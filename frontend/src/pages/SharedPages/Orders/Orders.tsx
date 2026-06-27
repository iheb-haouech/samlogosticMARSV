import { useState, useEffect, useMemo } from "react";
import {
  deleteOrder,
  fetchOrders,
  fetchOrderStatuses,
  selectcount,
  selectOrders,
  selectOrderStatus,
  updateOrder,
  updateOrderStatus,
  updateOrderDeliverPerson,
  togglePayment,
  markPaid,
  addOrder,
} from "../../../features/order/orderSlice";
import { store } from "../../../store/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import "./Orders.scss";
import DrawerComponent from "../../../components/molecules/drawer/DrawerComponent";
import UpdateOrderForm from "../../../components/templates/Forms/UpdateOrderForm/UpdateOrderForm";
import OrderInfo from "../../../components/templates/OrderDetails/OrderDetails";
import DeliveryPersonModal from "../../../components/molecules/Modals/DeliveryPersonModal/DeliveryPersonModal";
import {
  selectStatus as transportersStatus,
  setFilter as setFilterTransporters,
  fetchAllTransportersNoPagination,
  selectAllTransportersNoPagination,
} from "../../../features/transporter/transporterSlice";
import ReceiptDownloadModal from "../../../components/molecules/Modals/ReceiptDownloadModal/ReceiptDownloadModal";
import { addComplaint } from "../../../features/complaint/complaintSlice";
import { rolesMap } from "../../../types/Roles";
import { generateEtiquette } from "../../../services/generate_pdf";
import { message, Select, Button, Input, Tag, Modal, Form, InputNumber } from "antd";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineClock } from "react-icons/hi";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoAddCircleSharp } from "react-icons/io5";
import CreateOrderFlow from "../../../components/molecules/Modals/OrderTypeModal/CreateOrderFlow";

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  1: { label: "Non suivi", color: "default" },
  2: { label: "En attente", color: "orange" },
  3: { label: "En cours", color: "blue" },
  4: { label: "Livrée", color: "green" },
  5: { label: "Annulée", color: "red" },
  6: { label: "Retour colis", color: "orange" },
};

const STATUS_OPTIONS = [
  { value: 2, label: "En attente" },
  { value: 3, label: "En cours" },
  { value: 4, label: "Expédiée" },
  { value: 5, label: "Annulée" },
  { value: 6, label: "Retour colis" },
];

const Orders = () => {
  const currentUser: any = useSelector(selectCurrentUser);
  const orders = useSelector(selectOrders);
  const orderStatuses = useSelector(selectOrderStatus);
  const totalOrders = useSelector(selectcount);
  const _transportersStatus = useSelector(transportersStatus);
  const transporters = useSelector(selectAllTransportersNoPagination);

  const [isAssignDeliveryPersonModalOpen, setIsAssignDeliveryPersonModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>();
  const [isLabeltDownloadModalOpen, setIsLabeltDownloadModalOpen] = useState(false);
  const [clickedOrder, setClickedOrder] = useState<any>(null);
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [orderInfoDrawerOpen, setOrderInfoDrawerOpen] = useState(false);
  const [isCreateOrderFlowOpen, setIsCreateOrderFlowOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [priceForm] = Form.useForm();
  const [selectedOrderForPrice, setSelectedOrderForPrice] = useState<any>(null);

  useEffect(() => {
    store.dispatch(fetchOrderStatuses());
    store.dispatch(fetchOrders());
  }, []);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let result = orders;
    if (clientFilter !== "all") {
      result = result.filter((o: any) => o.createdBy?.accountType === clientFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o: any) => {
        const clientName = o.createdBy?.companyName || o.createdBy?.email || "";
        const tracking = o.trackingId || "";
        const dest = o.recipient?.city || "";
        return clientName.toLowerCase().includes(q) || tracking.toLowerCase().includes(q) || dest.toLowerCase().includes(q);
      });
    }
    return result;
  }, [orders, clientFilter, searchQuery]);

  const handleUpdateOrder = (order: any) => {
    setClickedOrder(order);
    setUpdateDrawerOpen(true);
    setOrderInfoDrawerOpen(false);
  };

  const handleOrderInfo = (order: any) => {
    setClickedOrder(order);
    setOrderInfoDrawerOpen(true);
    setUpdateDrawerOpen(false);
  };

  const handleAssignDelivery = (deliveryPersonId: number | null) => {
    if (clickedOrder) {
      store.dispatch(
        updateOrderDeliverPerson({
          id: clickedOrder.id,
          deliveredByUserId: deliveryPersonId,
        }),
      );
      setIsAssignDeliveryPersonModalOpen(false);
      setClickedOrder(null);
    }
  };

  const handleDeleteOrder = (id: string) => {
    Modal.confirm({
      title: "Supprimer la commande",
      content: "Etes-vous sûr de vouloir supprimer cette commande ?",
      okText: "Oui, supprimer",
      cancelText: "Non",
      okButtonProps: { danger: true },
      onOk: () => {
        store.dispatch(deleteOrder(id));
        message.success("Commande supprimée");
      },
    });
  };

  const openSetPriceModal = (order: any) => {
    setSelectedOrderForPrice(order);
    priceForm.setFieldsValue({
      deliveryPrice: order.transporterPrice || order.deliveryPrice || 0,
    });
    setPriceModalOpen(true);
  };

  const handleSavePrice = async () => {
    try {
      const values = await priceForm.validateFields();
      if (!selectedOrderForPrice) return;
      await store.dispatch(
        updateOrder({
          ...selectedOrderForPrice,
          transporterPrice: values.deliveryPrice,
        }),
      ).unwrap();
      message.success("Prix de livraison mis à jour");
      setPriceModalOpen(false);
      setSelectedOrderForPrice(null);
      priceForm.resetFields();
    } catch (err) {
      // validation failed
    }
  };

  const handleTogglePayment = async (order: any) => {
    const amount = order.transporterPrice || order.deliveryPrice || 0;
    if (!amount || amount <= 0) {
      message.warning("Veuillez d'abord définir le prix de livraison");
      return;
    }
    try {
      await store.dispatch(togglePayment({ orderId: order.id, amount })).unwrap();
      message.success("Paiement activé");
      store.dispatch(fetchOrders());
    } catch (err) {
      message.error("Erreur");
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    try {
      await store.dispatch(markPaid(orderId)).unwrap();
      message.success("Marqué payé");
      store.dispatch(fetchOrders());
    } catch (err) {
      message.error("Erreur");
    }
  };

  const getStatusTag = (statusId: number) => {
    const status = STATUS_MAP[statusId];
    if (!status) return <Tag>Inconnu</Tag>;
    return <Tag color={status.color}>{status.label}</Tag>;
  };

  const handleChangeOrderStatus = async (orderId: string, newStatusId: number) => {
    try {
      await store.dispatch(updateOrderStatus({ id: orderId, orderStatusId: newStatusId })).unwrap();
      message.success("Statut mis à jour");
      store.dispatch(fetchOrders());
    } catch (err) {
      message.error("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-page--header">
        <div className="admin-orders-page--title">
          <h2>Commandes</h2>
          <span className="admin-orders-page--count">{totalOrders}</span>
        </div>
        <div className="admin-orders-page--actions">
          <Button type="primary" icon={<IoAddCircleSharp />} onClick={() => setIsCreateOrderFlowOpen(true)}>
            Nouvelle commande
          </Button>
        </div>
      </div>

      <div className="admin-orders-page--filters">
        <Select
          size="small"
          value={clientFilter}
          onChange={setClientFilter}
          style={{ width: 130 }}
          options={[
            { value: "all", label: "Tous" },
            { value: "B2B", label: "B2B" },
            { value: "B2C", label: "B2C" },
          ]}
        />
        <Input
          size="small"
          placeholder="Rechercher client / tracking..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 220 }}
          allowClear
        />
      </div>

      <div className="admin-orders-page--list">
        {filteredOrders.length === 0 ? (
          <div className="admin-orders-page--empty">Aucune commande trouvée</div>
        ) : (
          filteredOrders.map((order: any) => {
            const client = order.createdBy || {};
            const clientName = client.companyName || client.email || "Inconnu";
            const clientType = client.accountType || "B2C";
            const isB2C = clientType === "B2C";
            const isFixedPrice = isB2C && order.subType === "envoieLegere";
            const deliveryPrice = order.transporterPrice || order.deliveryPrice || (isFixedPrice ? 7 : 0);

            return (
              <div key={order.id} className="order-card">
                <div className="order-card--header">
                  <div className="order-card--id">
                    #{order.trackingId || order.id?.slice(0, 8)}
                  </div>
                  {[rolesMap.admin, rolesMap.superAdmin].includes(currentUser?.roleId) ? (
                    <Select
                      size="small"
                      value={order.orderStatusId}
                      onChange={(newStatusId) => handleChangeOrderStatus(order.id, newStatusId)}
                      style={{ minWidth: 120 }}
                      options={STATUS_OPTIONS.filter((opt) => {
                        if (opt.value === 6) return isB2C;
                        return true;
                      })}
                    />
                  ) : (
                    getStatusTag(order.orderStatusId)
                  )}
                </div>

                <div className="order-card--body">
                  <div className="order-card--row">
                    <span className="order-card--label">Client:</span>
                    <span className="order-card--value">{clientName}</span>
                    <Tag color={clientType === "B2B" ? "blue" : "green"}>{clientType}</Tag>
                  </div>
                  <div className="order-card--row">
                    <MdOutlineLocationOn className="order-card--icon" />
                    <span className="order-card--value">
                      {order.recipient?.city || order.recipient?.companyName || "-"}
                    </span>
                  </div>
                  <div className="order-card--row">
                    <HiOutlineClock className="order-card--icon" />
                    <span className="order-card--value">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("fr-FR") : "-"}
                    </span>
                  </div>
                  <div className="order-card--row order-card--price-row">
                    <span className="order-card--label">Prix livraison:</span>
                    <span className="order-card--price">{deliveryPrice} DT</span>
                    {!isFixedPrice && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => openSetPriceModal(order)}
                      >
                        {deliveryPrice > 0 ? "Modifier" : "Définir"}
                      </Button>
                    )}
                  </div>
                  {order.deliveredBy && (
                    <div className="order-card--row">
                      <span className="order-card--label">Transporteur:</span>
                      <span className="order-card--value">
                        {order.deliveredBy.firstName || ""} {order.deliveredBy.lastName || ""}
                      </span>
                    </div>
                  )}
                </div>

                <div className="order-card--actions">
                  <Button size="small" icon={<HiOutlineEye />} onClick={() => handleOrderInfo(order)}>
                    Détails
                  </Button>
                  <Button size="small" icon={<HiOutlinePencilAlt />} onClick={() => handleUpdateOrder(order)}>
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    icon={<IoAddCircleSharp />}
                    onClick={() => {
                      store.dispatch(fetchAllTransportersNoPagination());
                      setClickedOrder(order);
                      setIsAssignDeliveryPersonModalOpen(true);
                    }}
                  >
                    {order.deliveredBy ? "Changer transporteur" : "Assigner"}
                  </Button>
                  {isB2C && order.orderStatusId === 4 && (
                    <Button
                      size="small"
                      onClick={() => {
                        setClickedOrder(order);
                        store.dispatch(
                          updateOrderStatus({ id: order.id, orderStatusId: 6 }),
                        );
                        message.success("Commande marquée en retour");
                        store.dispatch(fetchOrders());
                      }}
                    >
                      Retour
                    </Button>
                  )}
                  {(order.orderStatusId === 1 || order.orderStatusId === 2) && (
                    <Button
                      size="small"
                      danger
                      onClick={() => {
                        setClickedOrder(order);
                        store.dispatch(
                          updateOrderStatus({ id: order.id, orderStatusId: 5 }),
                        );
                        message.success("Commande annulée");
                        store.dispatch(fetchOrders());
                      }}
                    >
                      Annuler
                    </Button>
                  )}
                  {!order.paymentConfirmed && deliveryPrice > 0 && (
                    <Button size="small" type="primary" onClick={() => handleTogglePayment(order)}>
                      Payer
                    </Button>
                  )}
                  {order.paymentConfirmed && (
                    <Button size="small" onClick={() => handleMarkPaid(order.id)}>
                      Marqué payé
                    </Button>
                  )}
                  <Button size="small" danger icon={<HiOutlineTrash />} onClick={() => handleDeleteOrder(order.id)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <DeliveryPersonModal
        isDeliveryPersonModalOpen={isAssignDeliveryPersonModalOpen}
        deliveryPersons={transporters}
        handleClose={() => {
          setIsAssignDeliveryPersonModalOpen(false);
          setClickedOrder(null);
        }}
        onAssignDelivery={handleAssignDelivery}
        isloading={_transportersStatus == "loading"}
        order={clickedOrder}
        onSearchDeliveryPersonChange={(value) => {
          store.dispatch(setFilterTransporters({ verified: true, filtredFirstName: value }));
        }}
      />

      <CreateOrderFlow
        isOpen={isCreateOrderFlowOpen}
        onClose={() => setIsCreateOrderFlowOpen(false)}
        currentUser={currentUser}
        onCreateOrder={async (order) => {
          const createdOrd = await store.dispatch(addOrder(order)).unwrap();
          setCreatedOrder(createdOrd);
          setIsCreateOrderFlowOpen(false);
          setIsLabeltDownloadModalOpen(true);
          store.dispatch(fetchOrders());
        }}
      />

      <ReceiptDownloadModal
        isLabeltDownloadModalOpen={isLabeltDownloadModalOpen}
        handleClose={() => {
          setIsLabeltDownloadModalOpen(false);
          setCreatedOrder(null);
        }}
        handleDownloadLabel={() => {
          if (createdOrder?.id) {
            generateEtiquette(createdOrder.id);
          } else {
            alert("Something went wrong please try again");
          }
        }}
      />

      <DrawerComponent
        isOpen={updateDrawerOpen}
        content={
          <UpdateOrderForm
            order={clickedOrder!}
            onUpdateOrder={async (order) => {
              await store.dispatch(updateOrder(order));
              setUpdateDrawerOpen(false);
            }}
          />
        }
        handleClose={() => {
          setUpdateDrawerOpen(false);
          setClickedOrder(null);
        }}
        title="Modifier la commande"
      />

      <DrawerComponent
        isOpen={orderInfoDrawerOpen}
        content={
          <OrderInfo
            order={clickedOrder}
            isAdmin={[rolesMap.admin, rolesMap.superAdmin].includes(currentUser?.roleId)}
            orderStatuses={orderStatuses}
            addComplaint={(values) => {
              store.dispatch(
                addComplaint({
                  subject: values.subject,
                  orderId: clickedOrder.id,
                  messages: [{ messageContent: values.message, senderId: currentUser?.id }],
                } as any),
              );
            }}
          />
        }
        handleClose={() => {
          setOrderInfoDrawerOpen(false);
          setClickedOrder(null);
        }}
        title="Détails de la commande"
      />

      <Modal
        title="Définir le prix de livraison"
        open={priceModalOpen}
        onOk={handleSavePrice}
        onCancel={() => {
          setPriceModalOpen(false);
          setSelectedOrderForPrice(null);
          priceForm.resetFields();
        }}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <Form form={priceForm} layout="vertical">
          <Form.Item
            name="deliveryPrice"
            label="Prix de livraison (DT)"
            rules={[{ required: true, message: "Requis" }]}
          >
            <InputNumber min={0} step={0.5} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteOrder,
  fetchOrders,
  fetchOrderStatuses,
  selectcount,
  selectLimit,
  selectOrders,
  selectOrderStatus,
  setFilter,
  setFiltredStatus,
  setLimit,
  setPage,
  addOrder,
  updateOrder,
  selectStatus,
  updateOrderStatus,
  updateOrderDeliverPerson,
  togglePayment,
  markPaid,
} from "../../../features/order/orderSlice";
import { store } from "../../../store/store";
import OrdersTable from "../../../components/organisms/Tables/OrdersTable/OrdersTable";
import OrdersTableHeader from "../../../components/organisms/header/OrdersTableHeader/OrdersTableHeader";
import { selectCurrentUser } from "../../../features/user/userSlice";
import "./Orders.scss";
import Title from "antd/es/typography/Title";
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
import { useTranslation } from "react-i18next";
import { message } from "antd";
import CreateOrderFlow from "../../../components/molecules/Modals/OrderTypeModal/CreateOrderFlow";

const Orders = () => {
  const currentUser: any = useSelector(selectCurrentUser);
  const orders = useSelector(selectOrders);
  const orderStatuses = useSelector(selectOrderStatus);
  const totalOrders = useSelector(selectcount);
  const status = useSelector(selectStatus);
  const [isAssignDeliveryPersonModalOpen, setIsAssignDeliveryPersonModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>();
  const [isLabeltDownloadModalOpen, setIsLabeltDownloadModalOpen] = useState(false);
  const [clickedOrder, setClickedOrder] = useState<any>(null);
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [orderInfoDrawerOpen, setOrderInfoDrawerOpen] = useState(false);
  const limitOrdersPerPage = useSelector(selectLimit);
  const transporters = useSelector(selectAllTransportersNoPagination);
  const _transportersStatus = useSelector(transportersStatus);
  const { t } = useTranslation();

  useEffect(() => {
    store.dispatch(fetchOrderStatuses());
    store.dispatch(fetchOrders());
  }, []);

  const handleUpdateOrder = (order: any) => {
    setClickedOrder(order);
    setUpdateDrawerOpen(true);
    setOrderInfoDrawerOpen(false);
  };

  const [isCreateOrderFlowOpen, setIsCreateOrderFlowOpen] = useState(false);

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
    }
  };

  return (
    <>
      <div className="orders-container">
        <div className="orders-container--header">
          <Title level={4}>
            {t("totalNumberOfOrders")}: {totalOrders}
          </Title>

          <OrdersTableHeader
            onSearchChange={(value) => {
              store.dispatch(setFilter(value));
            }}
            onClickBtn={() => {
                setIsCreateOrderFlowOpen(true);
              }}
            btnText={t("addOrder")}
          />
        </div>

        <div className="orders-container--table">
          <OrdersTable
            orders={orders}
            totalOrders={totalOrders}
            status={status}
            limitOrdersPerPage={limitOrdersPerPage}
            isAdmin={currentUser?.roleId === 1}
            orderStatuses={orderStatuses}
            onPayOnline={(orderId: string, amount: number) => {
              alert(`Paiement Stripe ${amount} TND pour commande ${orderId}`);
            }}
            onPageChange={(page: any) => {
              store.dispatch(setPage(page));
            }}
            handlePageSizeChange={(_current, size) => {
              store.dispatch(setLimit(size));
            }}
            onUpdateOrder={handleUpdateOrder}
            onDeleteOrder={(id) => {
              store.dispatch(deleteOrder(id));
            }}
            onViewOrder={handleOrderInfo}
            handleOrderStatusFilter={(selectedStatus) => {
              store.dispatch(setFiltredStatus(selectedStatus));
            }}
            onChangeOrderState={(orderId: any, orderStatusId: any) => {
              store.dispatch(
                updateOrderStatus({
                  id: orderId,
                  orderStatusId: orderStatusId,
                }),
              );
            }}
            onAssignDeliveryPerson={(order: any) => {
              store.dispatch(fetchAllTransportersNoPagination());
              setClickedOrder(order);
              setIsAssignDeliveryPersonModalOpen(true);
            }}
            onTogglePayment={async (orderId) => {
              const amount = window.prompt("Montant en TND ?");
              if (amount) {
                try {
                  await store.dispatch(togglePayment({ orderId, amount: parseFloat(amount) })).unwrap();
                  message.success("Paiement activé");
                  setTimeout(() => {
                    store.dispatch(fetchOrders());
                  }, 500);
                } catch (err) {
                  message.error("Erreur");
                }
              }
            }}
            onMarkPaid={async (orderId) => {
              await store.dispatch(markPaid(orderId)).unwrap();
              await store.dispatch(fetchOrders());
              message.success("Marqué payé");
            }}
          />
        </div>
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
        title={"Modifier la commande"}
      />

      <DrawerComponent
        isOpen={orderInfoDrawerOpen}
        content={
          <OrderInfo
            order={clickedOrder}
            isAdmin={currentUser?.roleId === rolesMap.admin}
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
        title={"Détails de la commande"}
      />
    </>
  );
};

export default Orders;
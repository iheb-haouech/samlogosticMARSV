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
  togglePayment,   // ✅ AJOUTE
  markPaid,        // ✅ AJOUTE
} from "../../../features/order/orderSlice";
import { store } from "../../../store/store";
import OrdersTable from "../../../components/organisms/Tables/OrdersTable/OrdersTable";
import OrdersTableHeader from "../../../components/organisms/header/OrdersTableHeader/OrdersTableHeader";
import { selectCurrentUser } from "../../../features/user/userSlice";
import "./Orders.scss";
import Title from "antd/es/typography/Title";
import OrderTypeModal, { OrderType } from "../../../components/molecules/Modals/OrderTypeModal/OrderTypeModal";
import DrawerComponent from "../../../components/molecules/drawer/DrawerComponent";
import CreateOrderForm from "../../../components/templates/Forms/CreateOrderForm/CreateOrderForm";
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
import CreateAdminOrderForm from "../../../components/templates/Forms/CreateOrderForm/CreateAdminOrderForm";
import { message } from "antd";
const Orders = () => {
  const currentUser: any = useSelector(selectCurrentUser);
  const orders = useSelector(selectOrders);
  const orderStatuses = useSelector(selectOrderStatus);
  const totalOrders = useSelector(selectcount);
  const status = useSelector(selectStatus);
  const [isChooseOrderTypeModalOpen, setIsChooseOrderTypeModalOpen] = useState(false);
  const [isAssignDeliveryPersonModalOpen, setIsAssignDeliveryPersonModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>();
  const [isLabeltDownloadModalOpen, setIsLabeltDownloadModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clickedOrder, setClickedOrder] = useState<any>(null);
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [orderInfoDrawerOpen, setOrderInfoDrawerOpen] = useState(false);
  const limitOrdersPerPage = useSelector(selectLimit);
  const transporters = useSelector(selectAllTransportersNoPagination);
  const _transportersStatus = useSelector(transportersStatus);
  const { t } = useTranslation();
  //const [paymentAmount, setPaymentAmount] = useState<number>(0);

  useEffect(() => {
    // fetch all orders on mount component
    store.dispatch(fetchOrderStatuses());
    store.dispatch(fetchOrders());
  }, []);

  const handleUpdateOrder = (order: any) => {
    setClickedOrder(order);
    setUpdateDrawerOpen(true);
    setOrderInfoDrawerOpen(false); // Close OrderInfo drawer if open
  };
  

  const handleOrderInfo = (order: any) => {
    setClickedOrder(order);
    setOrderInfoDrawerOpen(true);
    setUpdateDrawerOpen(false); // Close UpdateOrderForm drawer if open
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
      <div className='orders-container'>
        <div className='orders-container--header'>
          <Title level={4}>
            {" "}
            {t("totalNumberOfOrders")}: {totalOrders}
          </Title>

          <OrdersTableHeader
            onSearchChange={(value) => {
              store.dispatch(setFilter(value));
            }}
            onClickBtn={() => {
              setIsChooseOrderTypeModalOpen(true);
            }}
            btnText={t("addOrder")}
          />
        </div>
        <div className='orders-container--table'>
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
                message.success('Paiement activé');
                // ✅ FORCE RELOAD
                setTimeout(() => {
                  store.dispatch(fetchOrders());
                }, 500);
              } catch (err) {
                message.error('Erreur');
              }
            }
          }}
            onMarkPaid={async (orderId) => {
              await store.dispatch(markPaid(orderId)).unwrap();
              await store.dispatch(fetchOrders());  // ✅ Reload
              message.success('Marqué payé');
            }}

          />
        </div>
      </div>
      {/* Assign Delivery Person  Modal */}
      <DeliveryPersonModal
        isDeliveryPersonModalOpen={isAssignDeliveryPersonModalOpen}
        deliveryPersons={transporters}
        handleClose={() => {
          setIsAssignDeliveryPersonModalOpen(false), setClickedOrder(null);
        }}
        onAssignDelivery={handleAssignDelivery}
        isloading={_transportersStatus == "loading"}
        order={clickedOrder}
        onSearchDeliveryPersonChange={(value) => {
          store.dispatch(setFilterTransporters({ verified: true, filtredFirstName: value }));
        }}
      />
      {/* Choose Order Type Modal */}
      <OrderTypeModal
        isModalOpen={isChooseOrderTypeModalOpen}
        handleClose={() => setIsChooseOrderTypeModalOpen(false)}
        handleOrderType={(orderType) => {
          setIsChooseOrderTypeModalOpen(false);
          setOrderType(orderType);
          setIsDrawerOpen(true);
        }}
      />

      {/* Create Order Drawer */}
      <DrawerComponent
        isOpen={isDrawerOpen}
        content={
          currentUser?.roleId === 1 ? (
            <CreateAdminOrderForm
              onCreateOrder={async (order) => {
                const createdOrd = await store.dispatch(addOrder(order)).unwrap();
                setCreatedOrder(createdOrd);
                setIsDrawerOpen(false);
                setIsLabeltDownloadModalOpen(true);
                // setIsDownloadEtiquetteModalOpen(true);
              }}
              orderType={orderType!}
              currentUser={currentUser}
            />
          ) : (
            <CreateOrderForm
              onCreateOrder={async (order) => {
                const createdOrd = await store.dispatch(addOrder(order)).unwrap();
                setCreatedOrder(createdOrd);
                setIsDrawerOpen(false);
                setIsLabeltDownloadModalOpen(true);
                // setIsDownloadEtiquetteModalOpen(true);
              }}
              orderType={orderType!}
              currentUser={currentUser}
            />
          )
        }
        handleClose={() => {
          setIsDrawerOpen(false);
        }}
        title={
          orderType === "deliverOrder"
            ? t("deliverNewOrder")
            : orderType === "bringOrder"
              ? t("bringNewOrder")
              : "Commande"
        }
      />
      {/* Download ETiquette Modal */}
      <ReceiptDownloadModal
        isLabeltDownloadModalOpen={isLabeltDownloadModalOpen}
        handleClose={() => {
          setIsLabeltDownloadModalOpen(false), setCreatedOrder(null);
        }}
        handleDownloadLabel={() => {
          if (createdOrder?.id) {
            generateEtiquette(createdOrder?.id);
          } else {
            alert("Something went wrong please try again");
          }
        }}
      />
      {/* Update Order Drawer */}
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
          setUpdateDrawerOpen(false), setClickedOrder(null);
        }}
        title={"Modifier la commande"}
      />

      {/* Order Info Drawer */}
      <DrawerComponent
        isOpen={orderInfoDrawerOpen}
        content={
          <OrderInfo
            order={clickedOrder}
            isAdmin={currentUser?.roleId === rolesMap.admin}
            orderStatuses={orderStatuses}
            addComplaint={(values) => {
              console.log("add complaint.", values);
              store.dispatch(
                addComplaint({
                  subject: values.subject,
                  orderId: clickedOrder.id,
                  messages: [{ messageContent: values.message, senderId: currentUser?.id }],
                } as any),
              );
              //TODO add complaint
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

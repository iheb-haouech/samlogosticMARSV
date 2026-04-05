import React, { useEffect, useState } from "react";
import "./ComplaintsChat.scss";
import ComplaintsList from "../../../components/organisms/ComplaintChat/ComplaintsList/ComplaintsList";
import MessageSection from "../../../components/organisms/ComplaintChat/MessageSection/MessageSection";
import { store } from "../../../store/store";
import {
  selectedComplaints,
  fetchAllComplaints,
  addMessage,
  deleteComplaint,
  setComplaintStatus,
  setComplaintsLimit,
  selectedLimit,
  selectedTotalCountComplaints,
  updateComplaint,
  setComplaintSearch,
} from "../../../features/complaint/complaintSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import { rolesMap } from "../../../types/Roles";
import { selectLoadingState, setLoading } from "../../../features/loading/loadingSlice";
import { Empty } from "antd";
import { Complaint } from "../../../types/Complaint";
import DrawerComponent from "../../../components/molecules/drawer/DrawerComponent";
import OrderInfo from "../../../components/templates/OrderDetails/OrderDetails";
import { getOrderById, selectFetchedOrder, selectOrderStatus } from "../../../features/order/orderSlice";

const ComplaintsChat: React.FC = () => {
  const orderStatuses = useSelector(selectOrderStatus);
  const complaints = useSelector(selectedComplaints);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [orderInfoDrawerOpen, setOrderInfoDrawerOpen] = useState(false);
  const fetchedOrder: any = useSelector(selectFetchedOrder);
  const currentUser: any = useSelector(selectCurrentUser);
  const loading = useSelector(selectLoadingState);
  const limit = useSelector(selectedLimit);
  const totalCountComplaints = useSelector(selectedTotalCountComplaints);
  const [status, setStatus] = useState<"1" | "3">("1"); // 1 for open and 2 for closed
  useEffect(() => {
    store.dispatch(setLoading(true));
    store.dispatch(fetchAllComplaints());
  }, []);
  console.log("REDUX COMPLAINTS:", complaints);
  useEffect(() => {
    if (complaints.length > 0 && !selectedComplaintId) {
      setSelectedComplaintId(complaints[0].id);
    }
  }, [complaints]);

  const selectedComplaint = complaints.find((complaint) => complaint.id === selectedComplaintId) || null;

  const handleSendMessage = (message: string) => {
    if (selectedComplaint) {
      store.dispatch(
        addMessage({ messageContent: message, claimId: selectedComplaint.id, senderId: currentUser?.id } as any),
      );
    }
  };

  const handleSelectComplaint = (complaint: Complaint) => {
    setSelectedComplaintId(complaint.id);
  };
  const handleViewOrderDetails = () => {
    if (selectedComplaint?.orderId) {
      store.dispatch(getOrderById(selectedComplaint?.orderId)).then(() => {
        setOrderInfoDrawerOpen(true);
      });
    }
  };
  const onLoadMoreComplaints = () => {
    store.dispatch(setComplaintsLimit(limit + 5));
  };
  return (
    <div className='chat-window'>
      <ComplaintsList
        complaints={complaints}
        isloading={loading}
        loadMoreComplaints={onLoadMoreComplaints}
        isLoadMore={totalCountComplaints <= limit ? true : false}
        totalCountComplaints={totalCountComplaints}
        onSearchChange={(value) => {
          store.dispatch(setComplaintSearch(value));
        }}
        handleSelectComplaint={handleSelectComplaint}
        defaultSelectedComplaintId={selectedComplaintId}
        isAdmin={currentUser?.roleId === rolesMap.admin}
        onTabChange={(key: string) => {
          const status = key === "1" ? "1" : "3";
          setStatus(status);
          setSelectedComplaintId(null);
          store.dispatch(setComplaintStatus(status));
        }}
      />
      {selectedComplaint == null ? (
        <Empty className='center-the-content' />
      ) : (
        <MessageSection
          key={selectedComplaint.id}
          messages={selectedComplaint?.messages || []}
          currentUser={currentUser}
          handleSendMessage={handleSendMessage}
          handelViewOrderDetails={handleViewOrderDetails}
          isAdmin={currentUser?.roleId === rolesMap.admin}
          trackingNumber={selectedComplaint?.order?.trackingId}
          companyName={selectedComplaint?.creator?.companyName}
          onDelete={() => {
            store.dispatch(deleteComplaint(selectedComplaint?.id));
            setSelectedComplaintId(null);
          }}
          onResolve={() => {
            store.dispatch(
              updateComplaint({
                id: selectedComplaint?.id,
                statusId: 3, // Resolved
              }),
            );
          }}
          status={status}
        />
      )}

      <DrawerComponent
        isOpen={orderInfoDrawerOpen}
        content={
          <OrderInfo
            order={fetchedOrder}
            isAdmin={currentUser?.roleId === rolesMap.admin}
            orderStatuses={orderStatuses}
          />
        }
        handleClose={() => {
          setOrderInfoDrawerOpen(false);
        }}
        title={"Détails de la commande"}
      />
    </div>
  );
};

export default ComplaintsChat;

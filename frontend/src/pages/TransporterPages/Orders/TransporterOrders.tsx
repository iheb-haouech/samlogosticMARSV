// frontend/src/pages/TransporterPages/Orders/TransporterOrders.tsx
import React, { useEffect, useState } from "react";
import { Button, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./TransporterOrders.scss";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useNavigate } from "react-router-dom";
import {
  fetchOrdersByTransporter,
  selectOrders,
  updateOrderStatus,
} from "../../../features/order/orderSlice";
import { selectCurrentUser } from "../../../features/user/userSlice";
type OrderStatus = "WAITING" | "IN_TRANSIT" | "DELIVERED" | "CANCELED";

interface TransporterOrderRow {
  id: string;
  trackingId: string;
  sourceCity: string;
  destinationCity: string;
  recipientName: string;
  status: OrderStatus;
}

const TransporterOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser) as any;
  const orders = useAppSelector(selectOrders);
  const navigate = useNavigate(); // 👈 ajoute ça
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!currentUser?.id) return;
      setLoading(true);
      await dispatch(fetchOrdersByTransporter({ transporterId: currentUser.id }));
      setLoading(false);
    };
    load();
  }, [dispatch, currentUser?.id]);

  const data: TransporterOrderRow[] =
  orders?.map((o: any) => {
    let status: OrderStatus;

    switch (o.orderStatusId) {
      case 1:
        status = "WAITING";      // created/pending
        break;
      case 2:
        status = "WAITING";      // assignée, en attente de départ
        break;
      case 3:
        status = "IN_TRANSIT";   // en cours
        break;
      case 4:
        status = "DELIVERED";    // livrée
        break;
      case 5:
      default:
        status = "CANCELED";     // annulée
        break;
    }

    return {
      id: o.id,
      trackingId: o.trackingId,
      sourceCity: o.source?.city || "",
      destinationCity: o.recipient?.city || "",    // pas o.destination
      recipientName: o.recipient?.companyName || "", // adapte si tu veux fullName
      status,
    };
  }) || [];

  const statusTag = (status: OrderStatus) => {
    console.log('statusName for order', status);
    if (status === "WAITING") return <Tag color="orange">En attente</Tag>;
    if (status === "IN_TRANSIT") return <Tag color="blue">En cours</Tag>;
    if (status === "DELIVERED") return <Tag color="green">Livrée</Tag>;
    return <Tag color="red">Annulée</Tag>;
  };

const toggleStatus = async (record: TransporterOrderRow) => {
  let nextOrderStatusId: number | null = null;

  if (record.status === "WAITING") nextOrderStatusId = 3;      // IN_TRANSIT
  else if (record.status === "IN_TRANSIT") nextOrderStatusId = 4; // DELIVERED
  else nextOrderStatusId = null;

  if (!nextOrderStatusId) return;

  const updatedOrder = {
    id: record.id,
    orderStatusId: nextOrderStatusId,   // 👈 clé que le backend comprend
  };

  await dispatch(updateOrderStatus(updatedOrder));

  if (currentUser?.id) {
    dispatch(fetchOrdersByTransporter({ transporterId: currentUser.id }));
  }
};


  const columns: ColumnsType<TransporterOrderRow> = [
    { title: "Tracking ID", dataIndex: "trackingId", key: "trackingId" },
    { title: "Source", dataIndex: "sourceCity", key: "sourceCity" },
    { title: "Destination", dataIndex: "destinationCity", key: "destinationCity" },
    { title: "Destinataire", dataIndex: "recipientName", key: "recipientName" },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (value: OrderStatus) => statusTag(value),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="small" onClick={() => navigate(`/transporter/orders/${record.id}`)} >
            Détails
          </Button>
          <Button
            size="small"
            type="primary"
            disabled={record.status === "DELIVERED" || record.status === "CANCELED"}
            onClick={() => toggleStatus(record)}
          >
            {record.status === "WAITING"
              ? "Démarrer la livraison"
              : record.status === "IN_TRANSIT"
              ? "Marquer comme livrée"
              : "Livrée"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="transporter-orders-page">
      <h2>Liste des commandes</h2>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TransporterOrders;

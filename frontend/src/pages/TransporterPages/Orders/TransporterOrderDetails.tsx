import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Tag, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getOrderById, selectFetchedOrder, setFetchedOrderToNull } from "../../../features/order/orderSlice";

const statusTag = (orderStatusId?: number) => {
  switch (orderStatusId) {
    case 1:
    case 2:
      return <Tag color="orange">En attente</Tag>;
    case 3:
      return <Tag color="blue">En cours</Tag>;
    case 4:
      return <Tag color="green">Livrée</Tag>;
    case 5:
    default:
      return <Tag color="red">Annulée</Tag>;
  }
};

const TransporterOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const order = useAppSelector(selectFetchedOrder);

  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id));
    }
    return () => {
      dispatch(setFetchedOrderToNull());
    };
  }, [id, dispatch]);

  if (!id) return <div>Aucune commande sélectionnée</div>;
  if (!order) return <div>Chargement...</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h2>Détails de la commande {order.trackingId}</h2>
        <Button onClick={() => navigate("/transporter/orders")}>← Retour à la liste</Button>
      </div>

      <Card title="Informations générales" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Tracking ID">
            {order.trackingId}
          </Descriptions.Item>
          <Descriptions.Item label="Statut">
            {statusTag(order.orderStatusId as number)}
          </Descriptions.Item>
          <Descriptions.Item label="Date de création">
            {order.createdAt ? new Date(order.createdAt as any).toLocaleString() : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Poids total">
            {order.totalWeight ?? "-"} kg
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Expéditeur" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="Nom / Société">
            {order.recipient?.companyName ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ville">
            {order.source?.city ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Adresse">
            {order.source?.streetAddress ?? order.source?.secondAddress ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Téléphone">
            {order.source?.phone ?? "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Destinataire">
        <Descriptions column={1}>
          <Descriptions.Item label="Nom / Société">
            {order.recipient?.companyName ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ville">
            {order.recipient?.city ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Adresse">
            {order.recipient?.streetAddress ?? order.recipient?.secondAddress ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Téléphone">
            {order.recipient?.phone ?? "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default TransporterOrderDetails;

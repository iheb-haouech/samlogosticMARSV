// frontend/src/pages/TransporterPages/Orders/TransporterOrders.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Tag, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CameraOutlined, CloseCircleOutlined, UndoOutlined } from "@ant-design/icons";
import "./TransporterOrders.scss";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useNavigate } from "react-router-dom";
import {
  fetchOrdersByTransporter,
  selectOrders,
  updateOrderStatus,
} from "../../../features/order/orderSlice";
import { selectCurrentUser } from "../../../features/user/userSlice";
import { apiClient } from "../../../api";

type OrderStatus = "WAITING" | "IN_TRANSIT" | "DELIVERED" | "CANCELED" | "RETURNED";

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingScanOrderId, setPendingScanOrderId] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!currentUser?.id) return;
      setLoading(true);
      await dispatch(fetchOrdersByTransporter({ transporterId: currentUser?.id }));
      setLoading(false);
    };
    load();
  }, [dispatch, currentUser?.id]);

  const data: TransporterOrderRow[] =
    orders?.map((o: any) => {
      let status: OrderStatus;
      switch (o.orderStatusId) {
        case 1:
        case 2:
          status = "WAITING";
          break;
        case 3:
          status = "IN_TRANSIT";
          break;
        case 4:
          status = "DELIVERED";
          break;
        case 5:
          status = "CANCELED";
          break;
        case 6:
          status = "RETURNED";
          break;
        default:
          status = "CANCELED";
      }

      return {
        id: o.id,
        trackingId: o.trackingId,
        sourceCity: o.source?.city || "",
        destinationCity: o.recipient?.city || "",
        recipientName: o.recipient?.companyName || "",
        status,
      };
    }) || [];

  const statusTag = (status: OrderStatus) => {
    if (status === "WAITING") return <Tag color="orange">En attente</Tag>;
    if (status === "IN_TRANSIT") return <Tag color="blue">En cours</Tag>;
    if (status === "DELIVERED") return <Tag color="green">Livrée</Tag>;
    if (status === "RETURNED") return <Tag color="orange">En retour</Tag>;
    return <Tag color="red">Annulée</Tag>;
  };

  const toggleStatus = async (record: TransporterOrderRow) => {
    if (currentUser?.blocked) {
      message.error("Compte bloque. Livraison non autorisee.");
      return;
    }
    if (record.status === "CANCELED" || record.status === "RETURNED") return;

    const nextOrderStatusId = record.status === "DELIVERED" ? 3 : 4;

    await dispatch(
      updateOrderStatus({
        id: record.id,
        orderStatusId: nextOrderStatusId,
      }),
    );

    if (currentUser?.id) {
      dispatch(fetchOrdersByTransporter({ transporterId: currentUser?.id }));
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      await dispatch(
        updateOrderStatus({
          id: selectedOrderId,
          orderStatusId: 5,
        }),
      ).unwrap();
      message.success("Commande annulée.");
      setCancelModalOpen(false);
      setSelectedOrderId(null);
    } catch {
      message.error("Erreur lors de l'annulation.");
    }
  };

  const handleReturnOrder = async () => {
    if (!selectedOrderId) return;
    try {
      await dispatch(
        updateOrderStatus({
          id: selectedOrderId,
          orderStatusId: 6,
        }),
      ).unwrap();
      message.success("Commande marquée en retour.");
      setReturnModalOpen(false);
      setSelectedOrderId(null);
    } catch {
      message.error("Erreur lors du retour.");
    }
  };

  const openCameraForOrder = (orderId: string) => {
    setPendingScanOrderId(orderId);
    fileInputRef.current?.click();
  };

  const handleLabelCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const orderId = pendingScanOrderId;
    event.target.value = "";
    setPendingScanOrderId(null);
    if (!file || !orderId) return;

    setUploadingId(orderId);
    try {
      await apiClient.uploadPod.uploadPodControllerUploadFile({
        order_id: orderId,
        file,
      } as any);
      message.success("Photo etiquette enregistree.");
    } catch {
      message.error("Echec upload etiquette.");
    } finally {
      setUploadingId(null);
    }
  };

  const columns: ColumnsType<TransporterOrderRow> = [
    { title: "Numero de suivi", dataIndex: "trackingId", key: "trackingId" },
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
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Button size="small" onClick={() => navigate(`/transporter/orders/${record.id}`)}>
            Détails
          </Button>
          <Button
            size="small"
            icon={<CameraOutlined />}
            loading={uploadingId === record.id}
            disabled={record.status === "CANCELED" || record.status === "RETURNED"}
            onClick={() => openCameraForOrder(record.id)}
            title="Scanner etiquette"
          />
          {record.status !== "CANCELED" && record.status !== "RETURNED" && (
            <Button
              size="small"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setSelectedOrderId(record.id);
                setCancelModalOpen(true);
              }}
              title="Annuler la commande"
            >
              Annuler
            </Button>
          )}
          {record.status === "IN_TRANSIT" && (
            <Button
              size="small"
              icon={<UndoOutlined />}
              onClick={() => {
                setSelectedOrderId(record.id);
                setReturnModalOpen(true);
              }}
              title="Marquer comme retour"
            >
              Retour
            </Button>
          )}
          <Button
            size="small"
            type="primary"
            disabled={record.status === "CANCELED" || record.status === "RETURNED"}
            onClick={() => toggleStatus(record)}
          >
            {record.status === "DELIVERED" ? "Pas encore livree" : "Marquer comme livree"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="transporter-orders-page">
        <h2>Liste des commandes</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleLabelCapture}
        />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </section>

      <Modal
        title="Confirmer l'annulation"
        open={cancelModalOpen}
        onOk={handleCancelOrder}
        onCancel={() => {
          setCancelModalOpen(false);
          setSelectedOrderId(null);
        }}
        okText="Oui, annuler"
        cancelText="Non"
        okButtonProps={{ danger: true }}
      >
        <p>Etes-vous sûr de vouloir annuler cette commande ?</p>
      </Modal>

      <Modal
        title="Confirmer le retour"
        open={returnModalOpen}
        onOk={handleReturnOrder}
        onCancel={() => {
          setReturnModalOpen(false);
          setSelectedOrderId(null);
        }}
        okText="Oui, retour"
        cancelText="Non"
      >
        <p>Etes-vous sûr de vouloir marquer cette commande comme retournee ?</p>
      </Modal>
    </>
  );
};

export default TransporterOrders;

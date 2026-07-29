// frontend/src/pages/TransporterPages/Orders/TransporterOrders.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Tag, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    if (status === "WAITING") return <Tag color="orange">{t("statusEnAttente")}</Tag>;
    if (status === "IN_TRANSIT") return <Tag color="blue">{t("statusEnTransit")}</Tag>;
    if (status === "DELIVERED") return <Tag color="green">{t("statusLivre")}</Tag>;
    if (status === "RETURNED") return <Tag color="orange">{t("returned")}</Tag>;
    return <Tag color="red">{t("statusAnnulee")}</Tag>;
  };

  const toggleStatus = async (record: TransporterOrderRow) => {
    if (currentUser?.blocked) {
      message.error(t("compteBloque"));
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
      message.success(t("commandeAnnulee"));
      setCancelModalOpen(false);
      setSelectedOrderId(null);
    } catch {
      message.error(t("erreurAnnulation"));
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
      message.success(t("commandeRetour"));
      setReturnModalOpen(false);
      setSelectedOrderId(null);
    } catch {
      message.error(t("erreurRetour"));
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
      message.success(t("etiquetteEnvoyer"));
    } catch {
      message.error(t("echecEtiquette"));
    } finally {
      setUploadingId(null);
    }
  };

  const columns: ColumnsType<TransporterOrderRow> = [
    { title: t("trackingNumber"), dataIndex: "trackingId", key: "trackingId" },
    { title: t("sourceCity"), dataIndex: "sourceCity", key: "sourceCity" },
    { title: t("destinationCity"), dataIndex: "destinationCity", key: "destinationCity" },
    { title: t("recipientName"), dataIndex: "recipientName", key: "recipientName" },
    {
      title: t("orderStatus"),
      dataIndex: "status",
      key: "status",
      render: (value: OrderStatus) => statusTag(value),
    },
    {
      title: t("actions"),
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
            title={t("scannerEtiquette")}
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
              title={t("annulerCommande")}
            >
              {t("annuler")}
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
              title={t("marquerRetour")}
            >
              {t("retour")}
            </Button>
          )}
          <Button
            size="small"
            type="primary"
            disabled={record.status === "CANCELED" || record.status === "RETURNED"}
            onClick={() => toggleStatus(record)}
          >
            {record.status === "DELIVERED" ? t("pasEncoreLivree") : t("marquerLivree")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="transporter-orders-page">
        <h2>{t("listeCommandes")}</h2>
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
        title={t("confirmerAnnulation")}
        open={cancelModalOpen}
        onOk={handleCancelOrder}
        onCancel={() => {
          setCancelModalOpen(false);
          setSelectedOrderId(null);
        }}
        okText={t("ouiAnnuler")}
        cancelText={t("non")}
        okButtonProps={{ danger: true }}
      >
        <p>{t("confirmAnnulationMessage")}</p>
      </Modal>

      <Modal
        title={t("confirmerRetour")}
        open={returnModalOpen}
        onOk={handleReturnOrder}
        onCancel={() => {
          setReturnModalOpen(false);
          setSelectedOrderId(null);
        }}
        okText={t("ouiRetour")}
        cancelText={t("non")}
      >
        <p>{t("confirmRetourMessage")}</p>
      </Modal>
    </>
  );
};

export default TransporterOrders;

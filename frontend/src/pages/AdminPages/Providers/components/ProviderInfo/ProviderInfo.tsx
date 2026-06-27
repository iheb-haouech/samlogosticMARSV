import React, { useEffect, useState } from "react";
import "./Providers.scss";
import { Avatar, Descriptions, Tag, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ApiClientWithHeaders } from "../../../../../api";
import ProvidersOrdersDataTable from "./ProvidersOrdersDataTable";
import { store } from "../../../../../store/store";
import { fetchOrderStatuses } from "../../../../../features/order/orderSlice";

const ProviderInfo: React.FC<{ id: string }> = ({ id }) => {
   const [provider, setProvider]: any = useState(null);
  const token: any = localStorage.getItem("accessToken");
  const myClient = ApiClientWithHeaders(token);

  useEffect(() => {
    const getProvider = async () => {
      try {
        const resp = await myClient.user.userControllerFindOne(id);
        const providerData = await resp?.data;
        setProvider(providerData);
      } catch (err) {
        console.error("Error fetching provider", err);
      }
    };
    if (id) getProvider();
  }, [id]);

  useEffect(() => {
    store.dispatch(fetchOrderStatuses());
  }, []);

  if (!provider) {
    return <div style={{ padding: 24, textAlign: "center" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: "#3479E8" }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{provider?.email || "Client"}</div>
          <div style={{ color: "#666" }}>{provider?.phone || "—"}</div>
          <Tag color={provider?.accountType === "B2B" ? "blue" : "green"} style={{ marginTop: 4 }}>
            {provider?.accountType || "B2C"}
          </Tag>
        </div>
      </div>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Email">{provider?.email || "—"}</Descriptions.Item>
        <Descriptions.Item label="Téléphone">{provider?.phone || "—"}</Descriptions.Item>
        <Descriptions.Item label="Ville">{provider?.city || "—"}</Descriptions.Item>
        <Descriptions.Item label="Pays">{provider?.country || "—"}</Descriptions.Item>
        <Descriptions.Item label="Adresse">{provider?.address || "—"}</Descriptions.Item>
        <Descriptions.Item label="Code postal">{provider?.zipCode || "—"}</Descriptions.Item>
        <Descriptions.Item label="Patent">{provider?.patent || "—"}</Descriptions.Item>
        <Descriptions.Item label="Site web">{provider?.websiteUrl || "—"}</Descriptions.Item>
      </Descriptions>

      <Divider />
      <h4>Commandes du client</h4>
      <ProvidersOrdersDataTable orders={provider?.createOrders} />
    </div>
  );
};

export default ProviderInfo;

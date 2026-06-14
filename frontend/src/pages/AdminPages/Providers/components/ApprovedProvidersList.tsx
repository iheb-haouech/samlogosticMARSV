import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Drawer, Popconfirm, Tooltip, Select, Tag, Card, Space, message } from "antd";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import { store } from "../../../../store/store";
import { ApiClientWithHeaders } from "../../../../api";
import {
  selectProviders,
  setFilter,
  updateProviders,
} from "../../../../features/provider/providerSlice";
import ProviderInfo from "./ProviderInfo/ProviderInfo";
import { useTranslation } from "react-i18next";
import Search, { SearchProps } from "antd/es/input/Search";

const ApprovedProvidersList: React.FC = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const providers = useSelector(selectProviders);
  const [clientTypeFilter, setClientTypeFilter] = useState<string>("all");

  const token: any = localStorage.getItem("accessToken");
  const myClient = ApiClientWithHeaders(token);

  const fetchClients = async (typeFilter?: string) => {
    try {
      const filterParams: any = { verified: true };
      if (typeFilter && typeFilter !== "all") {
        filterParams.accountType = typeFilter;
      }
      store.dispatch(setFilter({ verified: true, filtredEmail: "" } as any));
      const res = await myClient.user.userControllerFindAllProviders({
        page: "1",
        limit: "100",
        ...filterParams,
      } as any);
      store.dispatch(updateProviders(res.data));
    } catch (err) {
      console.error("Error fetching clients", err);
    }
  };

  useEffect(() => {
    fetchClients(clientTypeFilter);
  }, [clientTypeFilter]);

  const [selectedProviderId, setSelectedProviderId] = useState("");
  const providersData = useMemo(() => {
    return providers?.map((user: any) => ({
      key: user.id,
      name: user.fullName || user.email,
      email: user.email,
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "-",
      telephone: user.phone || "-",
      patent: user.patent || "-",
      accountType: user.accountType || "B2C",
      id: user.id,
    })) ?? [];
  }, [providers]);

  const handleDeleteUser = async (id: any) => {
    try {
      store.dispatch(updateProviders(id));
      await myClient.user.userControllerRemove(id);
      message.success("Client supprimé");
    } catch (err) {
      message.error("Erreur lors de la suppression");
    }
  };

  const showDrawer = (id: string) => {
    setOpen(true);
    setSelectedProviderId(id);
  };

  const onSearch: SearchProps["onSearch"] = async (filtredEmail: string) => {
    try {
      const res = await myClient.user.userControllerFindAllProviders({
        page: "1",
        limit: "100",
        verified: true,
        email: filtredEmail,
        ...(clientTypeFilter !== "all" ? { accountType: clientTypeFilter } : {}),
      } as any);
      store.dispatch(updateProviders(res.data));
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns: Array<any> = [
    {
      title: t("client_name", "Nom"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("email", "Email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("client_type", "Type"),
      dataIndex: "accountType",
      key: "accountType",
      render: (type: string) => <Tag color={type === "B2B" ? "blue" : "green"}>{type || "B2C"}</Tag>,
    },
    {
      title: t("phone_number", "Téléphone"),
      dataIndex: "telephone",
      key: "telephone",
    },
    {
      title: t("patent", "Patent"),
      dataIndex: "patent",
      key: "patent",
    },
    {
      title: t("actions", "Actions"),
      key: "actions",
      width: 140,
      render: (user: any) => (
        <Space size="middle">
          <Tooltip title={t("details", "Détails")}>
            <Button type="primary" shape="circle" size="small" icon={<HiOutlineEye />} onClick={() => showDrawer(user.id)} />
          </Tooltip>
          <Tooltip title={t("delete", "Supprimer")}>
            <Popconfirm title={t("delete_confirmation", "Confirmer la suppression")} onConfirm={() => handleDeleteUser(user.id)}>
              <Button danger shape="circle" size="small" icon={<HiOutlineTrash />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <b>
            {t("all_clients", "Liste des clients")} ({providersData.length})
          </b>
        </div>
        <Space wrap>
          <Select
            value={clientTypeFilter}
            onChange={(val) => setClientTypeFilter(val)}
            style={{ width: 140 }}
            options={[
              { value: "all", label: t("all", "Tous") },
              { value: "B2B", label: "B2B" },
              { value: "B2C", label: "B2C" },
            ]}
          />
          <Search
            placeholder={t("Search_by_email", "Rechercher par email")}
            allowClear
            onSearch={onSearch}
            style={{ width: 220 }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={providersData}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `${total} clients` }}
        size="middle"
        scroll={{ x: 800 }}
      />

      <Drawer title={t("provider_info_title", "Informations client")} onClose={onClose} open={open} size="large">
        <ProviderInfo id={selectedProviderId} />
      </Drawer>
    </Card>
  );
};

export default ApprovedProvidersList;

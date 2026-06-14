import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Select,
  Dropdown,
  Typography,
  Input,
  Tag,
} from "antd";
import type { MenuProps, TableProps } from "antd";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import formatDate from "../../../../services/date";
import { getOrderStatusesName } from "../../../../services/order_status";
import { useMemo, useState } from "react";
import {
  DownOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { getOrderStatusText } from "../../../../services/orderStatusService";
import { useTranslation } from "react-i18next";
import OrderStatusTag from "../../../atoms/orderStatusTag/OrderStatusTag";

const { Text } = Typography;
const { Search } = Input;

interface OrdersTableProps {
  orders: any[];
  totalOrders: number;
  status: string;
  limitOrdersPerPage: number;
  isAdmin: boolean;
  orderStatuses: any[];
  onPageChange: (page: number) => void;
  handlePageSizeChange: (current: number, size: number) => void;
  onUpdateOrder: (order: any) => void;
  onDeleteOrder: (id: string) => void;
  onViewOrder: (order: any) => void;
  handleOrderStatusFilter: (status: string) => void;
  onChangeOrderState: (orderId: string, statusId: number) => void;
  onAssignDeliveryPerson: (order: any) => void;
}

const OrdersTable = ({
  orders,
  totalOrders,
  status,
  limitOrdersPerPage,
  isAdmin,
  orderStatuses,
  onPageChange,
  handlePageSizeChange,
  onUpdateOrder,
  onDeleteOrder,
  onViewOrder,
  handleOrderStatusFilter,
  onChangeOrderState,
  onAssignDeliveryPerson,
}: OrdersTableProps) => {
  const { t } = useTranslation();
  const [clientFilter, setClientFilter] = useState("all");

  const tableContent = useMemo(() => {
    if (!orders) return [];
    return orders.map((order, idx) => ({
      ...order,
      _idx: idx + 1,
    }));
  }, [orders]);

  const visibleOrders = useMemo(() => {
    if (clientFilter === "all") return tableContent;
    return tableContent.filter((o: any) => {
      const type = o.createdBy?.accountType || o.accountType;
      return type === clientFilter;
    });
  }, [tableContent, clientFilter]);

  const onOrderStatusFilterChange: MenuProps["onClick"] = ({ key }) => {
    handleOrderStatusFilter(key);
  };

  const translatedOrderStatuses = getOrderStatusesName(orderStatuses);

  const items: MenuProps["items"] = [
    { key: "all", label: t("all") },
    ...(orderStatuses || []).map((status: any) => ({
      key: String(status.id),
      label: getOrderStatusText(t, status?.statusName),
    })),
  ];

  const columns: TableProps<any>["columns"] = [
    {
      title: "#",
      key: "num",
      width: 50,
      align: "center",
      render: (_: any, rec: any) => rec._idx,
    },
    {
      title: t("creationDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      render: (d: string) => formatDate(d),
    },
    {
      title: t("recipientName"),
      dataIndex: "recipient",
      key: "recipient",
      width: 160,
      render: (r: any) => r?.companyName || r?.city || "-",
    },
    {
      title: "Client",
      key: "client",
      width: 170,
      render: (_: any, rec: any) => {
        const c = rec.createdBy || {};
        const name = c.companyName || c.email || "-";
        const color = c.accountType === "B2B" ? "blue" : c.accountType === "B2C" ? "green" : "default";
        return (
          <Space direction="vertical" size={0}>
            <Text>{name}</Text>
            {c.accountType && <Tag color={color}>{c.accountType}</Tag>}
          </Space>
        );
      },
    },
    {
      title: (
        <Dropdown menu={{ items, selectable: true, defaultSelectedKeys: ["all"], onClick: onOrderStatusFilterChange }}>
          <Typography.Link>
            <Space>
              Statut <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      ),
      dataIndex: "orderStatus",
      key: "orderStatusId",
      width: 130,
      render: (orderStatusId: number) => {
        const status = orderStatuses?.find((s: any) => s.id === orderStatusId);
        if (!status) return <Text>-</Text>;
        if (isAdmin) {
          return (
            <Select
              size="small"
              style={{ minWidth: 120 }}
              value={status.id}
              onChange={(newStatus) => onChangeOrderState(String(orderStatusId), newStatus)}
              options={(translatedOrderStatuses || []).map((s: any) => ({
                value: s.id,
                label: getOrderStatusText(t, s.statusName),
              }))}
            />
          );
        }
        return <OrderStatusTag orderStatuses={orderStatuses} orderStatusId={orderStatusId} />;
      },
    },
    {
      title: "Transporteur",
      key: "transporter",
      width: 140,
      render: (_: any, rec: any) => {
        const order = rec;
        const name = order.deliveredBy
          ? `${order.deliveredBy.firstName || ""} ${order.deliveredBy.lastName || ""}`.trim() || order.deliveredBy.email
          : null;
        if (!name) {
          return (
            <Button type="link" size="small" onClick={() => onAssignDeliveryPerson(order)} icon={<CustomerServiceOutlined />}>
              Assigner
            </Button>
          );
        }
        return <Text>{name}</Text>;
      },
    },
    {
      title: t("actions"),
      key: "action",
      width: 120,
      fixed: "right" as const,
      render: (_: any, rec: any) => (
        <Space size="small">
          <Tooltip title="Voir">
            <Button size="small" icon={<HiOutlineEye />} onClick={() => onViewOrder(rec)} />
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="Modifier">
                <Button size="small" icon={<HiOutlinePencilAlt />} onClick={() => onUpdateOrder(rec)} />
              </Tooltip>
              <Popconfirm title={t("deleteOrder")} onConfirm={() => onDeleteOrder(rec.id)}>
                <Tooltip title={t("deleteTitle")}>
                  <Button size="small" danger icon={<HiOutlineTrash />} loading={status === "loading"} />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <Text>{totalOrders} {t("items")}</Text>
        <Space size="small" wrap>
          <Select
            size="small"
            value={clientFilter}
            onChange={setClientFilter}
            style={{ width: 120 }}
            options={[
              { value: "all", label: "Tous" },
              { value: "B2B", label: "B2B" },
              { value: "B2C", label: "B2C" },
            ]}
          />
          <Search
            size="small"
            placeholder="Rechercher..."
            style={{ width: 200 }}
            onSearch={(v) => {
              console.log("Search:", v);
            }}
          />
        </Space>
      </div>

      <Table
        size="small"
        loading={status === "loading"}
        rowKey="id"
        columns={columns}
        dataSource={visibleOrders}
        pagination={{
          pageSize: limitOrdersPerPage,
          total: totalOrders,
          showSizeChanger: true,
          onChange: onPageChange,
          onShowSizeChange: handlePageSizeChange,
        }}
        scroll={{ x: 850 }}
      />
    </div>
  );
};

export default OrdersTable;

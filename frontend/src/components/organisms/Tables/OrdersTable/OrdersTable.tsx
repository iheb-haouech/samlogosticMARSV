import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  message,
  Pagination,
  Select,
  Dropdown,
  Typography,
  Avatar,
  InputNumber,
} from "antd";
import type { MenuProps, TableProps } from "antd";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineClipboardCopy } from "react-icons/hi";
import copyToClipboard from "../../../../services/copy";
import formatDate from "../../../../services/date";
import { store } from "../../../../store/store";
const { Text } = Typography;
import { getOrderStatusesName } from "../../../../services/order_status";
import "./OrdersTable.scss";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  IssuesCloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getOrderStatusText } from "../../../../services/orderStatusService";
import { useTranslation } from "react-i18next";
import OrderStatusTag from "../../../atoms/orderStatusTag/OrderStatusTag";
import { Order } from "../../../../types/Order";
import { useSelector } from "react-redux";
import { selectLoadingState, setLoading } from "../../../../features/loading/loadingSlice";
import { IoAddCircleSharp } from "react-icons/io5";
import { CheckOutlined } from "@ant-design/icons";
import { updateOrder } from "../../../../features/order/orderSlice";

interface OrderTableRow {
  id: string;
  trackingNumber: string;
  createdAt: string;
  recipientCompanyName: string;
  orderStatus: any;
  actions: Order;
  totalPrice: number | null | undefined;
}

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
  onTogglePayment?: (orderId: string) => void;
  onMarkPaid?: (orderId: string) => void;
  onPayOnline?: (orderId: string, amount: number) => void;
}

const OrdersTable = ({
  orders,
  status,
  totalOrders,
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
  const [pageSize, setPageSize] = useState<number>(limitOrdersPerPage);
  const [tableContent, setTableContent] = useState<OrderTableRow[]>([]);
  const [totalClientPrices, setTotalClientPrices] = useState<any>({});
  const [totalTransporterPrices, setTotalTransporterPrices] = useState<any>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const loading = useSelector(selectLoadingState);
  const translatedOrderStatuses = getOrderStatusesName(orderStatuses);

  // ✅ useEffect séparé pour resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ useEffect séparé pour tableContent
  useEffect(() => {
    const _tableContent = orders?.map((order) => ({
      id: order?.id!,
      trackingNumber: order?.id!,
      trackingId: order?.trackingId,
      createdAt: formatDate(order?.createdAt?.toString()),
      recipientCompanyName: order?.recipient?.companyName,
      orderStatus: order?.orderStatusId,
      deliveredByUserId: order?.deliveredByUserId,
      actions: order,
      totalPrice: order?.totalPrice,
      clientPrice: order?.clientPrice,
      transporterPrice: order?.transporterPrice,
      clientPriceStatusId: order?.clientPriceStatusId,
      transporterPriceStatusId: order?.transporterPriceStatusId,
      paymentRequired: order?.paymentRequired,
      paymentAmount: order?.paymentAmount,
      paymentStatus: order?.paymentStatus,
    }));
    setTableContent(_tableContent);
  }, [orders]);

  const handlePriceChange = (orderId: any, value: any) => {
    setTotalClientPrices((prevPrices: any) => ({
      ...prevPrices,
      [orderId]: value,
    }));
  };

  const handleTransporterPriceChange = (orderId: any, value: any) => {
    setTotalTransporterPrices((prevPrices: any) => ({
      ...prevPrices,
      [orderId]: value,
    }));
  };

  const confirmUpdatePrice = (orderId: any) => {
    const clientPrice = totalClientPrices[orderId];
    if (clientPrice) {
      store.dispatch(updateOrder({ id: orderId, clientPrice: clientPrice, clientPriceStatusId: 2 }));
    }
  };

  const confirmUpdateTranspoterPrice = (orderId: any) => {
    const transporterPrice = totalTransporterPrices[orderId];
    if (transporterPrice) {
      store.dispatch(updateOrder({ id: orderId, transporterPrice: transporterPrice, transporterPriceStatusId: 2 }));
    }
  };

  const cancel = (orderId: any, value: any) => {
    setTotalClientPrices((prevPrices: any) => ({
      ...prevPrices,
      [orderId]: value,
    }));
  };

  const cancelTransporter = (orderId: any, value: any) => {
    setTotalTransporterPrices((prevPrices: any) => ({
      ...prevPrices,
      [orderId]: value,
    }));
  };

  const getActionsOrder = (order: any) => {
    return (
      <>
        <Tooltip title='Edit'>
          <Button
            onClick={() => onUpdateOrder(order?.actions)}
            className='table--action-btn'
            icon={<HiOutlinePencilAlt />}
          />
        </Tooltip>

        <Tooltip title={t("deleteTitle")}>
          <Popconfirm
            title={t("deleteOrder")}
            onConfirm={() => {
              store.dispatch(setLoading(true));
              onDeleteOrder(order.id!);
            }}
          >
            <Button className='table--action-btn' icon={<HiOutlineTrash />} loading={loading} />
          </Popconfirm>
        </Tooltip>
      </>
    );
  };

  const onOrderStatusFilterChange: MenuProps["onClick"] = ({ key }) => {
    handleOrderStatusFilter(key);
  };

  const getOrderPriceStatus = (status: any) => {
    switch (status) {
      case 1:
        return <ExclamationCircleOutlined />;
      case 2:
        return <FieldTimeOutlined style={{ color: "#146af5" }} />;
      case 3:
        return <CheckCircleOutlined style={{ color: "#39bf2a" }} />;
      case 4:
        return <CloseCircleOutlined style={{ color: "#e82020" }} />;
      default:
        return <IssuesCloseOutlined />;
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "null",
      label: t("all"),
    },
    ...orderStatuses.map((status) => ({
      key: status.id.toString(),
      label: getOrderStatusText(t, status?.statusName),
    })),
  ];

  const columns: TableProps<any>["columns"] = [
    {
      title: "#",
      key: "number",
      width: 60,
      align: "center",
      render: (_, _record, index) => index + 1,
    },
    {
      title: t("trackingNumber"),
      dataIndex: "trackingId",
      key: "trackingId",
      render: (text) => (
        <Space>
          <span style={{ fontWeight: 500 }}>
            {text?.slice(0, 8)}...{text?.slice(-4)}
          </span>
          <Tooltip title={t("copy")}>
            <Button
              onClick={() => {
                copyToClipboard(text);
                message.success(`Numéro de suivi ${text} copié avec succès.`, 1.5);
              }}
              size="small"
              className='table--action-btn'
              icon={<HiOutlineClipboardCopy />}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: t("creationDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (creationDate: string) => formatDate(creationDate),
    },
    {
      title: t("recipientName"),
      dataIndex: "recipientCompanyName",
      key: "recipientCompanyName",
    },
    {
      title: (
        <Dropdown
          menu={{ items, selectable: true, defaultSelectedKeys: ["null"], onClick: onOrderStatusFilterChange }}
        >
          <Typography.Link>
            <Space>
              {t("statut")}
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      ),
      dataIndex: "orderStatus",
      key: "orderStatusId",
      render: (orderStatusId: number, order: any) => {
        const status = orderStatuses?.find((s) => s?.id === orderStatusId);
        if (!status) return <span>-</span>;

        if (isAdmin) {
          return (
            <Select
              value={status.id}
              size="small"
              style={{ minWidth: 140 }}
              onChange={(newStatus) => onChangeOrderState(order.id, newStatus)}
              options={translatedOrderStatuses?.map((s: any) => ({
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
      title: t("actions"),
      key: "action",
      fixed: "right",
      render: (order) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button
              onClick={() => onViewOrder(order.actions)}
              className="table--action-btn"
              icon={<HiOutlineEye />}
            />
          </Tooltip>
          {isAdmin || order.orderStatus === 1 || order.orderStatus === 2 ? getActionsOrder(order) : null}
        </Space>
      ),
    },
  ];

  // ✅ Colonnes admin
  if (isAdmin && columns) {
    columns.splice(
      -1,
      0,
      {
        title: `${t("clientPrice")} (TND)`,
        dataIndex: "clientPrice",
        key: "clientPrice",
        align: "right",
        render: (clientPrice: any, order: any) => {
          return (
            <>
              <Button
                type="link"
                className="assign-delivery-btn"
                onClick={() => onAssignDeliveryPerson(order.actions)}
                icon={<IoAddCircleSharp style={{ fontSize: 18 }} />}
              >
                {t("assignTransporter")}
              </Button>
              <Space.Compact style={{ width: "100%" }}>
                <InputNumber
                  style={{ width: 120 }}
                  placeholder="0.0"
                  variant="filled"
                  type="number"
                  step={1}
                  min={0}
                  value={totalClientPrices[order.id] || clientPrice}
                  onChange={(value) => handlePriceChange(order.id, value)}
                  suffix={<span>{getOrderPriceStatus(order.clientPriceStatusId)}</span>}
                />
                <Popconfirm
                  title={t("confirmClientPrice")}
                  description={`${t("updatePriceTo")} ${totalClientPrices[order.id] || clientPrice || 0} TND?`}
                  onConfirm={() => confirmUpdatePrice(order.id)}
                  onCancel={() => cancel(order.id, clientPrice)}
                  okText='Oui'
                  cancelText='Non'
                >
                  <Button icon={<CheckOutlined />} disabled={[3, 4, 5].includes(order.orderStatus)} />
                </Popconfirm>
              </Space.Compact>
            </>
          );
        },
      },
      {
        title: `${t("transporterPrice")} (TND)`,
        dataIndex: "transporterPrice",
        key: "transporterPrice",
        align: "right",
        render: (transporterPrice: any, order: any) => {
          return (
            <div style={{ minWidth: 100 }}>
              <Space.Compact style={{ width: "100%" }}>
                <InputNumber
                  style={{ width: 120 }}
                  placeholder='0.0'
                  variant='filled'
                  type='number'
                  step='1'
                  min={0}
                  value={totalTransporterPrices[order.id] || transporterPrice}
                  onChange={(value) => handleTransporterPriceChange(order.id, value)}
                  suffix={<span>{getOrderPriceStatus(order?.transporterPriceStatusId)}</span>}
                />
                <Popconfirm
                  title={t("confirmTransporterPrice")}
                  description={`${t("updatePriceTo")} ${totalTransporterPrices[order.id] || transporterPrice || 0} TND?`}
                  onConfirm={() => confirmUpdateTranspoterPrice(order.id)}
                  onCancel={() => cancelTransporter(order.id, transporterPrice)}
                  okText='Oui'
                  cancelText='Non'
                >
                  <Button icon={<CheckOutlined />} disabled={[3, 4, 5].includes(order.orderStatus)} />
                </Popconfirm>
              </Space.Compact>
            </div>
          );
        },
      },
      {
        title: `${t("transporter")}`,
        dataIndex: "deliveredByUserId",
        key: "deliveredByUserId",
        render: (deliveredByUserId: any, order: any) => {
          return (
            <>
              {deliveredByUserId ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                  onClick={() => onAssignDeliveryPerson(order?.actions)}
                >
                  <Avatar size='small' icon={<UserOutlined />} />
                  <Text>{order?.actions?.deliveredBy?.firstName + " " + order?.actions?.deliveredBy?.lastName}</Text>
                </div>
              ) : (
                <Text
                  className='Assign-delivery-btn'
                  type='danger'
                  onClick={() => onAssignDeliveryPerson(order?.actions)}
                >
                  {(order?.actions?.deliveredBy?.firstName + " " + order?.actions?.deliveredBy?.lastName).slice(0, 18)}
                  {((order?.actions?.deliveredBy?.firstName + " " + order?.actions?.deliveredBy?.lastName) || "").length > 18 ? "..." : ""}
                  <IoAddCircleSharp style={{ width: "1.25rem", height: "1.25rem" }} /> {t("assignTransporter")}
                </Text>
              )}
            </>
          );
        },
      }
    );
  }

  const onPageSizeChange = (_current: number, size: number) => {
    setPageSize(size);
    handlePageSizeChange(_current, size);
  };

  const [tableHeight, setTableHeight] = useState(300);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const { top } = ref.current.getBoundingClientRect();
      const TABLE_HEADER_HEIGHT = 55;
      setTableHeight(window.innerWidth - top - TABLE_HEADER_HEIGHT - 100);
    }
  }, [ref]);

  // ✅ Styles conditionnels propres
  const containerStyle: React.CSSProperties = {
    height: "100%",
    overflow: "auto",
    padding: isMobile ? '8px' : '0',
  };

  const paginationStyle: React.CSSProperties = isMobile
    ? {
        margin: "12px 8px",
        textAlign: "center",
        justifyContent: "center",
      }
    : {
        margin: "26px",
        textAlign: "right",
        justifyContent: "flex-end",
      };

  return (
    <div ref={ref} style={containerStyle}>
      <Table
        loading={status === "loading"}
        rowKey='id'
        columns={columns}
        dataSource={tableContent}
        pagination={false}
        scroll={{
          y: tableHeight,
          x: isMobile ? 'max-content' : 700,
        }}
        size={isMobile ? 'small' : 'middle'}
      />
      <Pagination
        style={paginationStyle}
        total={totalOrders}
        pageSize={pageSize}
        showSizeChanger={!isMobile}
        showTotal={(total, range) =>
          isMobile
            ? `${range[0]}-${range[1]}/${total}`
            : `${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`
        }
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
        simple={isMobile}
      />
    </div>
  );
};

export default OrdersTable;

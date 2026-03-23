import { Tag } from "antd";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "../../../types/Order";
interface OrderStatusTagProps {
  orderStatusId: number;
  orderStatuses: OrderStatus[];
}
const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ orderStatuses, orderStatusId }) => {
  const { t } = useTranslation();

  let color;
  let statusText;

  const orderStatus = orderStatuses.find((status) => status.id === orderStatusId)?.statusName || "Error";
  console.log("OrderStatusTag:", { orderStatusId, orderStatus, orderStatuses });
  switch (orderStatus.toLowerCase()) {
    case "created":
      color = "cyan";
      statusText = t("notTracked");
      break;
    case "pending":
      color = "orange";
      statusText = t("pending");
      break;
    case "in transit":
      color = "processing";
      statusText = t("inTransit");
      break;
    case "delivered":
      color = "success";
      statusText = t("delivered");
      break;
    case "canceled":
      color = "error";
      statusText = t("canceled");
      break;
    default:
      color = "default";
      statusText = orderStatus;
  }

  return (
    <Tag key={orderStatusId} color={color}>
      {statusText}
    </Tag>
  );
};

export default OrderStatusTag;

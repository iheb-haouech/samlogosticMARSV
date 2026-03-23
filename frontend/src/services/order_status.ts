import { useTranslation } from "react-i18next";
import { OrderStatus } from "../types/Order";

export const getStatusColor = (orderStatus: number): string => {
  switch (orderStatus) {
    case 1:
      return "blue"; // Created
    case 2:
      return "orange"; // Pending
    case 3:
      return "green"; // In transit
    case 4:
      return "cyan"; // Delivered
    case 5:
      return "red"; // Canceled
    default:
      return "gray";
  }
};

export const getOrderStatusName = (orderStatusId: number): string => {
  switch (orderStatusId) {
    case 1:
      return "Created"; // Created
    case 2:
      return "Pending"; // Pending
    case 3:
      return "In transit"; // In transit
    case 4:
      return "Delivered"; // Delivered
    case 5:
      return "Canceled"; // Canceled
    default:
      return "gray";
  }
};

export const getOrderStatusesName = (orderStatuses: OrderStatus[]): OrderStatus[] => {
  const { t } = useTranslation();

  return orderStatuses.map((orderStatus) => {
    let statusText;
    switch (parseInt(orderStatus?.id)) {
      case 1:
        statusText = t("notTracked");
        break;
      case 2:
        statusText = t("pending");
        break;
      case 3:
        statusText = t("inTransit");
        break;
      case 4:
        statusText = t("delivered");
        break;
      case 5:
        statusText = t("canceled");
        break;
      default:
        statusText = orderStatus?.statusName;
    }

    return {
      ...orderStatus,
      statusName: statusText,
    };
  });
};

// orderStatusService.js

export const getOrderStatusText = (t: any, orderStatus: string) => {
  let statusText;

  switch (orderStatus.toLowerCase()) {
    case "created":
      statusText = t("notTracked");
      break;
    case "pending":
      statusText = t("pending");
      break;
    case "in transit":
      statusText = t("inTransit");
      break;
    case "delivered":
      statusText = t("delivered");
      break;
    case "canceled":
      statusText = t("canceled");
      break;
    default:
      statusText = orderStatus;
  }

  return statusText;
};

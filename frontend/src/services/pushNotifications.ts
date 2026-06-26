import { PushNotifications } from "@capacitor/push-notifications";

export const initPushNotifications = async () => {
  const permission = await PushNotifications.requestPermissions();

  if (permission.receive === "granted") {
    await PushNotifications.register();
  }

  PushNotifications.addListener("registration", async (token) => {
    localStorage.setItem("pushToken", token.value);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await fetch(`${import.meta.env.VITE_BASE_URL}/user/save-push-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ pushToken: token.value }),
        });
      }
    } catch (err) {
      console.error("Failed to save push token", err);
    }
  });

  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    showInAppNotification(notification.title, notification.body);
  });

  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    const data = action.notification.data;
    handleNotificationClick(data);
  });
};

export const showInAppNotification = (title: string | undefined, body: string | undefined) => {
  if ("serviceWorker" in navigator && Notification.permission === "granted") {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.showNotification(title || "SAM LOGISTIC", {
          body: body || "",
          icon: "/png/logoslogan.png",
          badge: "/png/logoslogan.png",
          tag: "order-notification",
          data: { timestamp: Date.now() },
        });
      });
    });
  }

  const event = new CustomEvent("order-notification", {
    detail: { title, message: body },
  });
  window.dispatchEvent(event);
};

export const handleNotificationClick = (data: any) => {
  if (data?.orderId) {
    window.location.href = `/user/orders/${data.orderId}`;
  } else if (data?.type === "order_created") {
    window.location.href = "/transporter/orders";
  } else if (data?.type === "order_delivered") {
    window.location.href = "/user/orders";
  }
};

export const checkForNewOrdersAndNotify = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!currentUser?.id) return;

  const lastOrderTimestamp = localStorage.getItem("lastOrderTimestamp");
  const currentTimestamp = Date.now();

  if (lastOrderTimestamp) {
    const timeDiff = currentTimestamp - parseInt(lastOrderTimestamp);
    if (timeDiff > 30000) {
      if (currentUser.roleId === 2) {
        showInAppNotification("Nouvelle commande", "Vous avez reçu une nouvelle commande");
      }
    }
  }

  localStorage.setItem("lastOrderTimestamp", String(currentTimestamp));
};
import { useEffect, useState } from "react";
import { Alert } from "antd";
import { HiBell } from "react-icons/hi";
import "./NotificationBanner.scss";

const NotificationBanner = () => {
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState<{ title?: string; message?: string } | null>(null);

  useEffect(() => {
    const handleNotification = (e: any) => {
      setNotification({ title: e.detail.title, message: e.detail.message });
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    window.addEventListener("order-notification", handleNotification);
    return () => window.removeEventListener("order-notification", handleNotification);
  }, []);

  if (!visible || !notification) return null;

  return (
    <div className="notification-banner">
      <Alert
        message={notification.title}
        description={notification.message}
        type="info"
        showIcon
        icon={<HiBell />}
        closable
        onClose={() => setVisible(false)}
        banner
      />
    </div>
  );
};

export default NotificationBanner;
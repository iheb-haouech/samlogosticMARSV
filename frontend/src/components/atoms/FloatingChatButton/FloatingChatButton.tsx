import { useState } from "react";
import { useTranslation } from "react-i18next";
import { WhatsAppOutlined, CloseOutlined } from "@ant-design/icons";
import "./FloatingChatButton.scss";

const FloatingChatButton = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const messageText = encodeURIComponent(
      `Support request from ${i18n.language}: ${message}`
    );
    window.open(`https://wa.me/21625294513?text=${messageText}`, "_blank");
    setIsOpen(false);
    setMessage("");
  };

  return (
    <>
      {isOpen && (
        <div className="floating-chat-popup">
          <div className="floating-chat-header">
            <span>{t("contactSupport")}</span>
            <CloseOutlined onClick={() => setIsOpen(false)} />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("typeYourMessage")}
            rows={4}
          />
          <button onClick={handleSend}>{t("send")}</button>
        </div>
      )}
      <button
        className="floating-chat-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open support chat"
      >
        <WhatsAppOutlined />
      </button>
    </>
  );
};

export default FloatingChatButton;
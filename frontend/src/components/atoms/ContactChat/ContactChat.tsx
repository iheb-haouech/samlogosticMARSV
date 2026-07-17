import { useState } from "react";
import { Button, Form, Input, Modal, List, message } from "antd";
import { useTranslation } from "react-i18next";
import { SendOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import "./ContactChat.scss";
import { API_BASE_URL } from "../../../api";

interface Message {
  id: number;
  content: string;
  fromUser: boolean;
  createdAt: string;
}

const ContactChat = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { message: string }) => {
    if (!values.message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: values.message,
      fromUser: true,
      createdAt: new Date().toISOString(),
    };
    setMessages([...messages, userMessage]);
    form.resetFields();

    try {
      await fetch(`${API_BASE_URL}/contact/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: values.message,
          subject: "Support request",
        }),
      });
    } catch (error) {
      message.error("Message envoyé (mode hors ligne)");
    }
  };

  return (
    <>
      <Button
        className="contact-chat-button"
        shape="circle"
        size="large"
        icon={<CustomerServiceOutlined />}
        onClick={() => setVisible(true)}
      />

      <Modal
        title={t("contactSupport")}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        className="contact-chat-modal"
      >
        <div className="contact-chat-history">
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item
                style={{
                  justifyContent: msg.fromUser ? "flex-end" : "flex-start",
                }}
              >
                <div className={`chat-bubble ${msg.fromUser ? "user" : "admin"}`}>
                  {msg.content}
                </div>
              </List.Item>
            )}
          />
        </div>

        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="message" rules={[{ required: true }]}>
            <Input.TextArea
              rows={3}
              placeholder={t("typeYourMessage")}
              onPressEnter={(e) => {
                e.preventDefault();
                form.submit();
              }}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            block
          >
            {t("send")}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ContactChat;
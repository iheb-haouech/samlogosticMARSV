import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import "./CreateComplaintModal.scss";
import { useTranslation } from "react-i18next";

interface CreateComplaintModalProps {
  isCreateComplaintModaOpen: boolean;
  onCreateComplaintModaClose: () => void;
  createComplaint: (values: { subject: string; messageContent: string }) => void;
}

const CreateComplaintModal = ({
  isCreateComplaintModaOpen,
  onCreateComplaintModaClose,
  createComplaint,
}: CreateComplaintModalProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

const onFinish = (values: any) => {
  console.log("FORM VALUES:", values);

  createComplaint({
    subject: values.subject,
    messageContent: values.messageContent,
  });

  form.resetFields();
  onCreateComplaintModaClose();
};

  return (
    <Modal
      title={<Title level={4}>{t("addComplaint")}</Title>}
      open={isCreateComplaintModaOpen}
      onCancel={onCreateComplaintModaClose}
      footer={
        <div style={{ display: "flex", gap: "1rem", justifyContent: "end" }}>
          <Button danger onClick={onCreateComplaintModaClose}>
            {t("cancel")}
          </Button>
          <Button type='primary' loading={false} onClick={() => form.submit()}>
            {t("createComplaint")}
          </Button>
        </div>
      }
    >
      <div className='content' style={{ display: "flex", flexDirection: "column", margin: "1.5rem 0" }}>
        <Title level={5}>{t("complaintMsg")}</Title>
        <Form form={form} style={{ marginTop: "1rem" }} layout='vertical' size='large' onFinish={onFinish}>
          <Form.Item
            label={"Subject"}
            name='subject'
            rules={[
              {
                required: true,
                message: "Required field",
              },
            ]}
            hasFeedback
          >
            <Input id='subject' placeholder={"Subject"} type='text' />
          </Form.Item>
          <Form.Item
            label={"Description"}
            name='messageContent'
            rules={[
              {
                required: true,
                message: "Required field",
              },
            ]}
            hasFeedback
          >
            <TextArea placeholder='Description' />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateComplaintModal;

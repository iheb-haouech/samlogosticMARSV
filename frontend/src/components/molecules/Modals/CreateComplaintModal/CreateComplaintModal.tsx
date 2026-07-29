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
            label={t("subjectLabel")}
            name='subject'
            rules={[
              {
                required: true,
                message: t("requiredFieldLabel"),
              },
            ]}
            hasFeedback
          >
            <Input id='subject' placeholder={t("subjectLabel")} type='text' />
          </Form.Item>
          <Form.Item
            label={t("descriptionLabel")}
            name='messageContent'
            rules={[
              {
                required: true,
                message: t("requiredFieldLabel"),
              },
            ]}
            hasFeedback
          >
            <TextArea placeholder={t("descriptionLabel")} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateComplaintModal;

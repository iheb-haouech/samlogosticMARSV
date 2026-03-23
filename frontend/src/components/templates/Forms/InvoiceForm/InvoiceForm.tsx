import React, { useEffect } from "react";
import { Button, Form, DatePicker, Typography, Avatar } from "antd";
import "./InvoiceForm.scss";
import { DownloadOutlined } from "@ant-design/icons";
import { IoAddCircleSharp } from "react-icons/io5";
const { RangePicker } = DatePicker;
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

interface InvoiceDate {
  selectedUser?: any;
  from: string;
  to: string;
  tax: number;
  invoiceType: string;
}

interface InvoiceFormProps {
  userType?: "livreur" | "l'entreprise";
  invoiceType?: any;
  onSelectUserToGenerateInvoice?: () => void;
  onGenerateInvoice: (formData: InvoiceDate) => void;
  isAdmin: boolean;
  selectedUser?: any;
  setInvoiceData?: any;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  userType,
  invoiceType,
  onGenerateInvoice,
  onSelectUserToGenerateInvoice,
  isAdmin,
  selectedUser,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedUser !== undefined) {
      form.setFieldsValue({ selectedUser });
    }
  }, [selectedUser, form]);

  const addOneHour = (date: Date) => {
    const newDate = new Date(date.getTime());
    newDate.setHours(newDate.getHours() + 1);
    return newDate;
  };

  const handleFinish = (values: any) => {
    const startDate = addOneHour(values.period[0].toDate());
    const endDate = values.period[1].toDate();
    endDate.setHours(23, 59, 59, 999);
    const adjustedEndDate = addOneHour(endDate);
    const startIsoString = startDate.toISOString();
    const endIsoString = adjustedEndDate.toISOString();

    const formData: InvoiceDate = {
      selectedUser: values.selectedUser,
      from: startIsoString,
      to: endIsoString,
      tax: values.tax,
      invoiceType,
    };

    onGenerateInvoice(formData);
    form.resetFields();
    form.setFieldsValue({ selectedUser: null });
  };

  const validatePeriod = (_: any, value: any) => {
    if (value) {
      const [startDate] = value;
      const now = new Date();
      if (startDate.isAfter(now)) {
        return Promise.reject(new Error("La période ne peut pas être dans le futur."));
      }
    }
    return Promise.resolve();
  };

  return (
    <div className='invoice-form--container'>
      <h2 className='invoice-form--title'>
        {t("generate_invoices_for")} {userType}
      </h2>
      <Form
        form={form}
        initialValues={{ selectedUser: selectedUser ? selectedUser : null }}
        layout='vertical'
        size='large'
        onFinish={handleFinish}
      >
        <div className='invoice-form--content'>
          <Form.Item
            label={t("select_period")}
            name='period'
            rules={[{ required: true, message: "Champs requis" }, { validator: validatePeriod }]}
            hasFeedback
          >
            <RangePicker
              id={{
                start: "from",
                end: "to",
              }}
              style={{ width: "100%" }}
              placeholder={[t("start_date"), t("end_date")]}
            />
          </Form.Item>
          {isAdmin && (
            <Form.Item
              label={`Sélectionnez ${userType}`}
              name='selectedUser'
              rules={[{ required: true, message: "Champs requis" }]}
              hasFeedback
            >
              <>
                {selectedUser ? (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                    onClick={onSelectUserToGenerateInvoice}
                  >
                    <Avatar size='small' icon={<UserOutlined />} />
                    <Text>
                      {userType === "livreur"
                        ? `${selectedUser.firstName} ${selectedUser.lastName}`
                        : selectedUser.companyName}
                    </Text>
                  </div>
                ) : (
                  <div className='Assign-user-container'>
                    <Text className='Assign-delivery-btn' type='danger' onClick={onSelectUserToGenerateInvoice}>
                      <IoAddCircleSharp style={{ width: "1.25rem", height: "1.25rem" }} /> {t("selected")} {userType}
                    </Text>
                  </div>
                )}
              </>
            </Form.Item>
          )}
        </div>
        <Button htmlType='submit' type='primary' className='invoice-form--generate-btn' icon={<DownloadOutlined />}>
          {t("generate_facture")}
        </Button>
      </Form>
    </div>
  );
};

export default InvoiceForm;

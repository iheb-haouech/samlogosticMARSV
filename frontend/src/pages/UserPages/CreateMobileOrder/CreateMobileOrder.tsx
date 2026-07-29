import { useState, useRef, useEffect } from "react";
import { Button, Input, message, Card, Space, Steps } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Order, PackagesData } from "../../../types/Order";
import PackageTable from "../../../components/organisms/Tables/PackageTable/PackageTable";
import type { InputRef } from "antd";
import { store } from "../../../store/store";
import { addOrder } from "../../../features/order/orderSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import "./CreateMobileOrder.scss";

interface CreateMobileOrderProps {
  onClose?: () => void;
}

const CreateMobileOrder: React.FC<CreateMobileOrderProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser: any = useSelector(selectCurrentUser);
  const isB2C = currentUser?.accountType === "B2C";

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    recipient: {
      companyName: "",
      phone: "",
      city: "",
      country: "",
      streetAddress: "",
      secondAddress: "",
      zipCode: "",
      email: "",
    },
    description: "",
  });
  const [packagesData, setPackagesData] = useState<PackagesData>({ packages: [], totalQuantity: 0, totalPrice: 0 });
  const inputRef = useRef<InputRef>(null);
  const [loading, setLoading] = useState(false);

  const isLightShipment = true;
  const fixedShipmentPrice = isB2C && isLightShipment ? 7 : 0;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handlePackagesChange = (newPackagesData: PackagesData) => {
    setPackagesData(newPackagesData);
  };

  const handleNestedFieldsChange =
    (field: "recipient", nestedField: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: { ...prev[field], [nestedField]: event.target.value },
      }));
    };

  const handleSubmit = async () => {
    if (isB2C && packagesData?.packages.some((pkg: any) => !pkg.price || pkg.price <= 0)) {
      message.error(t("priceRequiredMsg"));
      return;
    }

    const packagesTotalPrice =
      packagesData?.packages.reduce(
        (total: number, pkg: any) => total + Number(pkg.price || 0) * Number(pkg.quantity || 1),
        0,
      ) || 0;

    const newOrderToSend: Order = {
      description: formValues.description,
      totalWeight: packagesData?.totalWeight || 0,
      totalQuantity: packagesData?.totalQuantity || 0,
      totalPrice: isB2C ? packagesTotalPrice : null,
      clientPrice: null,
      transporterPrice: null,
      packages: packagesData?.packages.map(({ index, ...pkgg }: any) => pkgg),
      refrences: [],
      shipmentPrice: fixedShipmentPrice,
      source: {
        email: currentUser?.email || "",
        companyName: currentUser?.companyName || "",
        phone: currentUser?.phone || "",
        city: currentUser?.city || "",
        country: currentUser?.country || "",
        streetAddress: currentUser?.address || "",
        secondAddress: "",
        zipCode: currentUser?.zipCode || "",
      },
      recipient: formValues.recipient,
      mainType: "national",
      subType: "envoieLegere",
    };

    setLoading(true);
    try {
      await store.dispatch(addOrder(newOrderToSend)).unwrap();
      message.success(t("orderCreatedSuccess"));
      navigate("/user/orders");
    } catch {
      message.error(t("orderCreateError"));
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return formValues.recipient.companyName && formValues.recipient.city;
    }
    if (currentStep === 1) {
      return packagesData.packages.length > 0;
    }
    return true;
  };

  const steps = [
    { title: t("stepRecipient") },
    { title: t("stepPackages") },
    { title: t("stepSummary") },
  ];

  if (isB2C && currentStep === 2) {
    return (
      <div className="create-mobile-order">
        <Card>
          <Space direction="vertical" style={{ width: "100%" }}>
            <h3>{t("stepSummary")}</h3>
            <div className="summary-section">
              <h4>{t("recipientTitle")}</h4>
              <p>{formValues.recipient.companyName}</p>
              <p>{formValues.recipient.city}</p>
            </div>
            <div className="summary-section">
              <h4>{t("packagesSummary", { count: packagesData.totalQuantity })}</h4>
              <p>{t("totalLabel")} {(packagesData.totalPrice || 0)} DT</p>
              {fixedShipmentPrice > 0 && <p>{t("transportFeesLabel")} {fixedShipmentPrice} DT</p>}
              <p className="total-amount">{t("totalTTC")} {(packagesData.totalPrice || 0) + fixedShipmentPrice} DT</p>
            </div>
            <Space>
              <Button onClick={() => setCurrentStep(1)}>{t("retour")}</Button>
              <Button type="primary" loading={loading} onClick={handleSubmit}>
                {t("validateOrder")}
              </Button>
            </Space>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="create-mobile-order">
      <div className="mobile-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            } else if (onClose) {
              onClose();
            }
          }}
        />
        <Steps current={currentStep} size="small" items={steps} style={{ flex: 1, marginLeft: 12 }} />
      </div>

      <div className="mobile-step-content">
        {currentStep === 0 && (
          <Card title={t("destinataire")}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder={t("companyLabel")}
                value={formValues.recipient.companyName}
                onChange={handleNestedFieldsChange("recipient", "companyName")}
                size="large"
              />
              <Input
                placeholder={t("cityLabel")}
                value={formValues.recipient.city}
                onChange={handleNestedFieldsChange("recipient", "city")}
                size="large"
              />
              <Input
                placeholder={t("phoneLabel")}
                value={formValues.recipient.phone}
                onChange={handleNestedFieldsChange("recipient", "phone")}
                size="large"
              />
              <Input
                placeholder={t("addressLabel")}
                value={formValues.recipient.streetAddress}
                onChange={handleNestedFieldsChange("recipient", "streetAddress")}
                size="large"
              />
            </Space>
          </Card>
        )}

        {currentStep === 1 && (
          <Card title={t("packages")}>
            <PackageTable
              packages={packagesData.packages}
              showPrice={isB2C}
              fixedShipmentPrice={fixedShipmentPrice}
              onPackagesChanges={handlePackagesChange}
            />
            {isB2C && packagesData.packages.length > 0 && (
              <div className="mobile-total">
                <Space>
                  <span>{t("totalPackages")}</span>
                  <strong>{packagesData.totalPrice} DT</strong>
                </Space>
                {fixedShipmentPrice > 0 && (
                  <Space>
                    <span>{t("transportFees")}</span>
                    <strong>{fixedShipmentPrice} DT</strong>
                  </Space>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="mobile-step-actions">
        <Button
          type="primary"
          size="large"
          block
          disabled={!canProceed()}
          onClick={() => currentStep < 2 && setCurrentStep(currentStep + 1)}
        >
          {currentStep < 2 ? t("nextStep") : t("createOrder")}
        </Button>
      </div>
    </div>
  );
};

export default CreateMobileOrder;
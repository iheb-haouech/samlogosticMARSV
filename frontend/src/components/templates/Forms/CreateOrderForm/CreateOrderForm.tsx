import { useEffect, useRef, useState } from "react";
import { Button, Input, Tag, message, Row, Col, Steps, Descriptions, Tooltip } from "antd";
import { PlusOutlined, UserOutlined, EnvironmentOutlined, InboxOutlined, CheckCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, SendOutlined } from "@ant-design/icons";
import { Order, PackagesData } from "../../../../types/Order";
import PackageTable from "../../../organisms/Tables/PackageTable/PackageTable";
import type { InputRef } from "antd";
import { useTranslation } from "react-i18next";
import "./CreateOrderForm.scss";

const BRAND_LOGO = "/png/logosam.png";

interface OrderMeta {
  mainType: "international" | "national" | "quote";
  tradeType?: "import" | "export";
  transportType?: "aerien" | "maritime" | "ground" | "livrer" | "apporter";
  subType?:
    | "consolidation"
    | "cts20"
    | "cts40"
    | "cts40hc"
    | "srberlie"
    | "srtole"
    | "envoieLegere"
    | "envoieStandard"
    | "camionTourisme"
    | "poidLourd5T"
    | "poidLourd10T"
    | "other";
  otherMessage?: string;
}

interface CreateOrderFormProps {
  onCreateOrder: (order: Order) => void;
  currentUser: any;
  orderMeta: OrderMeta;
}

const CreateOrderForm = ({ onCreateOrder, currentUser, orderMeta }: CreateOrderFormProps) => {
  const { t } = useTranslation();
  const isB2C = currentUser?.accountType === "B2C";
  const isLightShipment = orderMeta.subType === "envoieLegere";

  const newOrder: Order = {
    description: "",
    totalWeight: 0,
    totalQuantity: 0,
    totalPrice: null,
    clientPrice: null,
    transporterPrice: null,
    packages: [],
    refrences: [],
    mainType: orderMeta.mainType,
    tradeType: orderMeta.tradeType,
    transportType: orderMeta.transportType,
    subType: orderMeta.subType,
    otherMessage: orderMeta.otherMessage,
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
  };

  const [formValues, setFormValues] = useState<Order>(newOrder);
  const [tags, setTags] = useState<string[]>([]);
  const [packagesData, setPackagesData] = useState<PackagesData>({ packages: [], totalQuantity: 0 });
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      refrences: tags,
      packages: packagesData.packages,
      totalQuantity: packagesData.totalQuantity || 0,
      totalWeight: packagesData.totalWeight || 0,
    }));
  }, [packagesData, tags]);

  useEffect(() => {
    if (inputVisible && inputRef.current) inputRef.current.focus();
  }, [inputVisible]);

  const handlePackagesChange = (newPackagesData: PackagesData) => {
    setPackagesData(newPackagesData);
  };

  const handleNestedFieldsChange =
    (field: "source" | "recipient", nestedField: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: { ...prev[field], [nestedField]: event.target.value },
      }));
    };

  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const handleReferenceInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const handleSubmit = () => {
    if (isB2C && packagesData?.packages.some((pkg) => !pkg.price || pkg.price <= 0)) {
      message.error(t("priceRequiredMsg"));
      return;
    }

    const packagesTotalPrice =
      packagesData?.packages.reduce(
        (total, pkg) => total + Number(pkg.price || 0) * Number(pkg.quantity || 1),
        0,
      ) || 0;
    const shipmentPrice = isB2C && isLightShipment ? 7 : formValues?.shipmentPrice;

    const newOrderToSend: Order = {
      ...formValues,
      refrences: tags,
      totalWeight: packagesData?.totalWeight || 0,
      totalQuantity: packagesData?.totalQuantity || 0,
      totalPrice: isB2C ? packagesTotalPrice : formValues?.totalPrice,
      shipmentPrice,
      packages: packagesData?.packages.map(({ index, ...pakg }: any) => pakg),
      mainType: formValues?.mainType,
      tradeType: formValues?.tradeType,
      transportType: formValues?.transportType,
      subType: formValues?.subType,
      otherMessage: formValues?.otherMessage,
    };

    setLoading(true);
    onCreateOrder(newOrderToSend);
  };

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: t("senderSection"),
      icon: <UserOutlined />,
      content: "sender",
    },
    {
      title: t("recipientSection"),
      icon: <EnvironmentOutlined />,
      content: "recipient",
    },
    {
      title: t("packagesLabel"),
      icon: <InboxOutlined />,
      content: "packages",
    },
    {
      title: t("reviewOrder"),
      icon: <CheckCircleOutlined />,
      content: "review",
    },
  ];

  const canGoNext = () => {
    if (currentStep === 0) {
      return formValues.source.companyName && formValues.source.city;
    }
    if (currentStep === 1) {
      return formValues.recipient.companyName && formValues.recipient.city;
    }
    return true;
  };

  const renderSenderStep = () => (
    <div className="order-wizard__section">
      <div className="order-wizard__section-header">
        <div className="order-wizard__section-icon sender">
          <UserOutlined />
        </div>
        <div>
          <h3>{t("senderSection")}</h3>
          <p className="order-wizard__section-hint">{t("senderHint")}</p>
        </div>
      </div>
      <Row gutter={[20, 16]}>
        <Col xs={24} sm={12}>
          <label className="order-wizard__label">{t("companyLabel")} *</label>
          <Input
            size="large"
            value={formValues.source.companyName}
            onChange={handleNestedFieldsChange("source", "companyName")}
            placeholder={t("companyLabel")}
            className="order-wizard__input"
          />
        </Col>
        <Col xs={24} sm={12}>
          <label className="order-wizard__label">{t("cityLabel")} *</label>
          <Input
            size="large"
            value={formValues.source.city}
            onChange={handleNestedFieldsChange("source", "city")}
            placeholder={t("cityLabel")}
            className="order-wizard__input"
          />
        </Col>
        <Col xs={24} sm={12}>
          <label className="order-wizard__label">{t("phoneLabel")}</label>
          <Input
            size="large"
            value={formValues.source.phone}
            onChange={handleNestedFieldsChange("source", "phone")}
            placeholder="+216 XX XXX XXX"
            className="order-wizard__input"
          />
        </Col>
        <Col xs={24} sm={12}>
          <label className="order-wizard__label">{t("postalCodeLabel")}</label>
          <Input
            size="large"
            value={formValues.source.zipCode}
            onChange={handleNestedFieldsChange("source", "zipCode")}
            placeholder="XXXX"
            className="order-wizard__input"
          />
        </Col>
        <Col xs={24}>
          <label className="order-wizard__label">{t("addressLabel")}</label>
          <Input
            size="large"
            value={formValues.source.streetAddress}
            onChange={handleNestedFieldsChange("source", "streetAddress")}
            placeholder={t("addressLabel")}
            className="order-wizard__input"
          />
        </Col>
      </Row>
    </div>
  );

  const renderRecipientStep = () => (
    <div className="order-wizard__section">
      <div className="order-wizard__section-header">
        <div className="order-wizard__section-icon recipient">
          <EnvironmentOutlined />
        </div>
        <div>
          <h3>{t("recipientSection")}</h3>
          <p className="order-wizard__section-hint">{t("recipientHint")}</p>
        </div>
      </div>
      <Row gutter={[20, 16]}>
        <Col xs={24} sm={12}>
          <label className="order-wizard__label">{t("companyLabel")} *</label>
          <Input
            size="large"
            value={formValues.recipient.companyName}
            onChange={handleNestedFieldsChange("recipient", "companyName")}
            placeholder={t("societeDestinataire")}
            className="order-wizard__input"
          />
        </Col>
        <Col xs={24} sm={12}>
          <label className="order-wizard__label">{t("cityLabel")} *</label>
          <Input
            size="large"
            value={formValues.recipient.city}
            onChange={handleNestedFieldsChange("recipient", "city")}
            placeholder={t("cityLabel")}
            className="order-wizard__input"
          />
        </Col>
        <Col xs={24} sm={12}>
          <label className="order-wizard__label">{t("phoneLabel")}</label>
          <Input
            size="large"
            value={formValues.recipient.phone}
            onChange={handleNestedFieldsChange("recipient", "phone")}
            placeholder="+216 XX XXX XXX"
            className="order-wizard__input"
          />
        </Col>
        <Col xs={24} sm={12}>
          <label className="order-wizard__label">{t("postalCodeLabel")}</label>
          <Input
            size="large"
            value={formValues.recipient.zipCode}
            onChange={handleNestedFieldsChange("recipient", "zipCode")}
            placeholder="XXXX"
            className="order-wizard__input"
          />
        </Col>
        <Col xs={24}>
          <label className="order-wizard__label">{t("addressLabel")}</label>
          <Input
            size="large"
            value={formValues.recipient.streetAddress}
            onChange={handleNestedFieldsChange("recipient", "streetAddress")}
            placeholder={t("addressLabel")}
            className="order-wizard__input"
          />
        </Col>
      </Row>
    </div>
  );

  const renderPackagesStep = () => (
    <div className="order-wizard__section">
      <div className="order-wizard__section-header">
        <div className="order-wizard__section-icon packages">
          <InboxOutlined />
        </div>
        <div>
          <h3>{t("packagesAndDetails")}</h3>
          <p className="order-wizard__section-hint">{t("packagesHint")}</p>
        </div>
      </div>

      {/* Description */}
      <div className="order-wizard__field-group">
        <label className="order-wizard__label">{t("Description")}</label>
        <Input.TextArea
          rows={2}
          value={formValues.description}
          onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
          placeholder={t("optionnalDescription")}
          className="order-wizard__input"
        />
      </div>

      {/* References */}
      <div className="order-wizard__field-group">
        <label className="order-wizard__label">{t("referencesLabel")}</label>
        <div className="order-wizard__references">
          {tags.map((tag, i) => (
            <Tag key={i} closable onClose={() => handleTagClose(tag)} color="blue" className="order-wizard__tag">
              {tag}
            </Tag>
          ))}
          {inputVisible ? (
            <Input
              ref={inputRef}
              size="small"
              style={{ width: 120 }}
              value={inputValue}
              onChange={handleReferenceChange}
              onBlur={handleReferenceInputConfirm}
              onPressEnter={handleReferenceInputConfirm}
              className="order-wizard__input"
            />
          ) : (
            <Tag onClick={() => setInputVisible(true)} className="order-wizard__tag order-wizard__tag--add">
              <PlusOutlined /> {t("addReference")}
            </Tag>
          )}
        </div>
      </div>

      {/* Packages */}
      <div className="order-wizard__field-group">
        <label className="order-wizard__label">{t("packagesLabel")} *</label>
        <PackageTable
          packages={packagesData.packages}
          showPrice={isB2C}
          fixedShipmentPrice={isB2C && isLightShipment ? 7 : undefined}
          onPackagesChanges={handlePackagesChange}
        />
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="order-wizard__section">
      <div className="order-wizard__section-header">
        <div className="order-wizard__section-icon review">
          <CheckCircleOutlined />
        </div>
        <div>
          <h3>{t("reviewOrder")}</h3>
          <p className="order-wizard__section-hint">{t("reviewHint")}</p>
        </div>
      </div>

      <Descriptions bordered column={1} size="middle" className="order-wizard__review">
        <Descriptions.Item label={t("senderSection")}>
          <strong>{formValues.source.companyName}</strong> — {formValues.source.city}, {formValues.source.country}
          <br />{formValues.source.streetAddress} {formValues.source.zipCode ? `(${formValues.source.zipCode})` : ""}
          <br />{formValues.source.phone}
        </Descriptions.Item>
        <Descriptions.Item label={t("recipientSection")}>
          <strong>{formValues.recipient.companyName}</strong> — {formValues.recipient.city}, {formValues.recipient.country}
          <br />{formValues.recipient.streetAddress} {formValues.recipient.zipCode ? `(${formValues.recipient.zipCode})` : ""}
          <br />{formValues.recipient.phone}
        </Descriptions.Item>
        {formValues.description && (
          <Descriptions.Item label={t("Description")}>{formValues.description}</Descriptions.Item>
        )}
        {tags.length > 0 && (
          <Descriptions.Item label={t("referencesLabel")}>
            {tags.map((tag, i) => <Tag key={i} color="blue">{tag}</Tag>)}
          </Descriptions.Item>
        )}
        <Descriptions.Item label={t("packagesLabel")}>
          {packagesData.packages.length > 0 ? (
            <span>{packagesData.packages.length} colis — {packagesData.totalWeight || 0} kg</span>
          ) : (
            <Tag color="red">{t("noPackages")}</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  return (
    <div className="order-wizard">
      <div className="order-wizard__header">
        <img src={BRAND_LOGO} alt="SAM LOGISTIC" className="order-wizard__logo" />
        <div>
          <h2 className="order-wizard__title">{t("createNewOrder")}</h2>
          <p className="order-wizard__subtitle">{t("orderWizardSubtitle")}</p>
        </div>
      </div>

      <Steps
        current={currentStep}
        items={steps.map((step) => ({
          title: step.title,
          icon: step.icon,
        }))}
        className="order-wizard__steps"
      />

      <div className="order-wizard__content">
        {currentStep === 0 && renderSenderStep()}
        {currentStep === 1 && renderRecipientStep()}
        {currentStep === 2 && renderPackagesStep()}
        {currentStep === 3 && renderReviewStep()}
      </div>

      <div className="order-wizard__actions">
        {currentStep > 0 && (
          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            {t("previous")}
          </Button>
        )}
        <div className="order-wizard__actions-right">
          {currentStep < steps.length - 1 ? (
            <Tooltip title={!canGoNext() ? t("fillRequiredFields") : ""}>
              <Button
                size="large"
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  if (!canGoNext()) {
                    message.warning(t("fillRequiredFields"));
                    return;
                  }
                  setCurrentStep(currentStep + 1);
                }}
              >
                {t("next")}
              </Button>
            </Tooltip>
          ) : (
            <Button
              size="large"
              type="primary"
              icon={<SendOutlined />}
              loading={loading}
              onClick={handleSubmit}
              className="order-wizard__submit"
            >
              {t("createOrder")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrderForm;
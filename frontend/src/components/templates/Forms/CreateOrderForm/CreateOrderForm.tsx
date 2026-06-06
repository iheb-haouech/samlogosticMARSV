import { useEffect, useRef, useState } from "react";
import { Button, Col, Divider, Flex, Form, Input, InputRef, message, Row, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { Order, PackagesData } from "../../../../types/Order";
import PackageTable from "../../../organisms/Tables/PackageTable/PackageTable";
import "./CreateOrderForm.scss";
import { useSelector } from "react-redux";
import { selectLoadingState, setLoading } from "../../../../features/loading/loadingSlice";
import { store } from "../../../../store/store";
import { useTranslation } from "react-i18next";

interface CreateOrderFormProps {
  onCreateOrder: (order: Order) => void;
  currentUser: any;
  orderMeta: {
    mainType: "international" | "national" | "quote";
    tradeType?: "import" | "export";
    transportType?: "aerien" | "maritime" | "ground" | "livrer" | "apporter";
    subType?:
      | "groupement"
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
  };
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
  const loading = useSelector(selectLoadingState);
  const [tags, setTags] = useState<string[]>([]);
  const [packagesData, setPackagesData] = useState<PackagesData>({
    packages: [],
    totalQuantity: 0,
  });
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

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
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  const handleSubmit = () => {
    if (isB2C && packagesData?.packages.some((pkg) => !pkg.price || pkg.price <= 0)) {
      message.error("Veuillez saisir le prix de chaque colis.");
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

    store.dispatch(setLoading(true));
    onCreateOrder(newOrderToSend);
  };

  const handlePackagesChange = (newPackagesData: PackagesData) => {
    setPackagesData(newPackagesData);
  };

  const handleNestedFieldsChange =
    (field: "source" | "recipient", nestedField: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: event.target.value,
        },
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

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Form style={{ marginTop: "0.5rem" }} onFinish={handleSubmit} layout="vertical" size="large">
      <div className="order-form">
        <div style={{ marginBottom: "1rem" }}>
          <Tag color="blue">{formValues.mainType}</Tag>
          {formValues.tradeType && <Tag color="green">{formValues.tradeType}</Tag>}
          {formValues.transportType && <Tag color="orange">{formValues.transportType}</Tag>}
          {formValues.subType && <Tag color="purple">{formValues.subType}</Tag>}
          {formValues.otherMessage && <Tag color="red">{formValues.otherMessage}</Tag>}
        </div>

        <div className="order-form--partners">
          <div className="order-form--partners-header">
            <Title style={{ margin: "1rem" }} level={5}>
              {t("supplier2")}
            </Title>
            <Divider className="order-form--partners-header-divider" />
          </div>

          <div className="order-form--partners-content">
            <Row gutter={16}>
              <Col className="gutter-row" flex={1}>
                <Form.Item
                  label={t("company_name")}
                  name={["source", "companyName"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("company_name")}
                    onChange={handleNestedFieldsChange("source", "companyName")}
                    value={formValues.source.companyName}
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" flex={1}>
                <Form.Item
                  label={t("phone_number")}
                  name={["source", "phone"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("phone_number")}
                    onChange={handleNestedFieldsChange("source", "phone")}
                    value={formValues.source.phone}
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" flex={1}>
                <Form.Item
                  label={t("city")}
                  name={["source", "city"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("city")}
                    onChange={handleNestedFieldsChange("source", "city")}
                    value={formValues.source.city}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col flex={2}>
                <Form.Item
                  label={t("street_address")}
                  name={["source", "streetAddress"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("street_address")}
                    onChange={handleNestedFieldsChange("source", "streetAddress")}
                    value={formValues.source.streetAddress}
                  />
                </Form.Item>
              </Col>

              <Col flex={1}>
                <Form.Item
                  label={t("zip_code")}
                  name={["source", "zipCode"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("zip_code")}
                    onChange={handleNestedFieldsChange("source", "zipCode")}
                    value={formValues.source.zipCode}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        <div className="order-form--partners">
          <div className="order-form--partners-header">
            <Title style={{ margin: "1rem" }} level={5}>
              {t("destination")}
            </Title>
            <Divider className="order-form--partners-header-divider" />
          </div>

          <div className="order-form--partners-content">
            <Row gutter={16}>
              <Col className="gutter-row" flex={1}>
                <Form.Item
                  label={t("recipient_name")}
                  name={["recipient", "companyName"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("recipient_name")}
                    onChange={handleNestedFieldsChange("recipient", "companyName")}
                    value={formValues.recipient.companyName}
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" flex={1}>
                <Form.Item
                  label={t("phone_number")}
                  name={["recipient", "phone"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("phone_number")}
                    onChange={handleNestedFieldsChange("recipient", "phone")}
                    value={formValues.recipient.phone}
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" flex={1}>
                <Form.Item
                  label={t("city")}
                  name={["recipient", "city"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("city")}
                    onChange={handleNestedFieldsChange("recipient", "city")}
                    value={formValues.recipient.city}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col flex={2}>
                <Form.Item
                  label={t("street_address")}
                  name={["recipient", "streetAddress"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("street_address")}
                    onChange={handleNestedFieldsChange("recipient", "streetAddress")}
                    value={formValues.recipient.streetAddress}
                  />
                </Form.Item>
              </Col>

              <Col flex={1}>
                <Form.Item
                  label={t("zip_code")}
                  name={["recipient", "zipCode"]}
                  rules={[{ required: true, message: t("Required field") }]}
                >
                  <Input
                    placeholder={t("zip_code")}
                    onChange={handleNestedFieldsChange("recipient", "zipCode")}
                    value={formValues.recipient.zipCode}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        <section>
          <div className="order-form--description">
            <Form.Item name="description" label={t("order_description")}>
              <Input.TextArea
                rows={4}
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder={t("order_description")}
              />
            </Form.Item>
          </div>

          <div className="order-form--references">
            <Form.Item name="refrences" label={t("add_references")}>
              <Flex className="order-form--references-container" gap="4px 0" wrap="wrap">
                {tags.map((tag, index) => (
                  <Tag
                    className="order-form--references-container--tag"
                    key={index}
                    closable
                    onClose={() => handleTagClose(tag)}
                  >
                    {tag}
                  </Tag>
                ))}

                {inputVisible ? (
                  <Input
                    className="order-form--references-container--input"
                    ref={inputRef}
                    type="text"
                    size="small"
                    value={inputValue}
                    onChange={handleReferenceChange}
                    onBlur={handleReferenceInputConfirm}
                    onPressEnter={handleReferenceInputConfirm}
                  />
                ) : (
                  <Tag
                    className="order-form--references-container--new-tag"
                    onClick={() => setInputVisible(true)}
                    icon={<PlusOutlined />}
                  >
                    {t("add_reference")}
                  </Tag>
                )}
              </Flex>
            </Form.Item>
          </div>

          <div className="order-form--package-table">
            <Form.Item
              name="packages"
              rules={[
                {
                  validator: async () => {
                    if (packagesData.packages && packagesData.packages.length > 0) return;
                    throw new Error(t("add_packages"));
                  },
                },
              ]}
            >
              <PackageTable
                packages={packagesData.packages}
                showPrice={isB2C}
                fixedShipmentPrice={isB2C && isLightShipment ? 7 : undefined}
                onPackagesChanges={handlePackagesChange}
              />
            </Form.Item>
          </div>
        </section>

        <div className="order-form--submit-btn" style={{ marginTop: "1.5rem" }}>
          <Button loading={loading} icon={<PlusOutlined />} size="large" type="primary" htmlType="submit" shape="round">
            {t("submit_order")}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateOrderForm;

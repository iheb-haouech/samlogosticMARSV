import { useEffect, useRef, useState } from "react";
import { Button, Input, Tag, message, Card, Space, Row, Col } from "antd";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { Order, PackagesData } from "../../../../types/Order";
import PackageTable from "../../../organisms/Tables/PackageTable/PackageTable";
import { useTranslation } from "react-i18next";
import type { InputRef } from "antd";

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

    setLoading(true);
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

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div>
          <Title level={5}>Expéditeur</Title>
          <Row gutter={12}>
            <Col span={12}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Société</label>
                <Input value={formValues.source.companyName} onChange={handleNestedFieldsChange("source", "companyName")} placeholder="Société" />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Ville</label>
                <Input value={formValues.source.city} onChange={handleNestedFieldsChange("source", "city")} placeholder="Ville" />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Téléphone</label>
                <Input value={formValues.source.phone} onChange={handleNestedFieldsChange("source", "phone")} placeholder="+216 XX XXX XXX" />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Code postal</label>
                <Input value={formValues.source.zipCode} onChange={handleNestedFieldsChange("source", "zipCode")} placeholder="XXXX" />
              </div>
            </Col>
            <Col span={24}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Adresse</label>
                <Input value={formValues.source.streetAddress} onChange={handleNestedFieldsChange("source", "streetAddress")} placeholder="Adresse" />
              </div>
            </Col>
          </Row>
        </div>

        <div>
          <Title level={5}>Destinataire</Title>
          <Row gutter={12}>
            <Col span={12}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Société *</label>
                <Input value={formValues.recipient.companyName} onChange={handleNestedFieldsChange("recipient", "companyName")} placeholder="Société destinataire" />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Ville *</label>
                <Input value={formValues.recipient.city} onChange={handleNestedFieldsChange("recipient", "city")} placeholder="Ville" />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Téléphone</label>
                <Input value={formValues.recipient.phone} onChange={handleNestedFieldsChange("recipient", "phone")} placeholder="+216 XX XXX XXX" />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Code postal</label>
                <Input value={formValues.recipient.zipCode} onChange={handleNestedFieldsChange("recipient", "zipCode")} placeholder="XXXX" />
              </div>
            </Col>
            <Col span={24}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Adresse</label>
                <Input value={formValues.recipient.streetAddress} onChange={handleNestedFieldsChange("recipient", "streetAddress")} placeholder="Adresse" />
              </div>
            </Col>
          </Row>
        </div>

        <div>
          <Title level={5}>Détails</Title>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Description</label>
            <Input.TextArea
              rows={2}
              value={formValues.description}
              onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
              placeholder="Description optionnelle..."
            />
          </div>
          <div>
            <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Références</label>
            <Space.Compact style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {tags.map((tag, i) => (
                <Tag key={i} closable onClose={() => handleTagClose(tag)}>{tag}</Tag>
              ))}
              {inputVisible ? (
                <Input
                  ref={inputRef}
                  size="small"
                  value={inputValue}
                  onChange={handleReferenceChange}
                  onBlur={handleReferenceInputConfirm}
                  onPressEnter={handleReferenceInputConfirm}
                />
              ) : (
                <Tag onClick={() => setInputVisible(true)} icon={<PlusOutlined />}>Ajouter référence</Tag>
              )}
            </Space.Compact>
          </div>
        </div>

        <div>
          <Title level={5}>Colis</Title>
          <PackageTable
            packages={packagesData.packages}
            showPrice={isB2C}
            fixedShipmentPrice={isB2C && isLightShipment ? 7 : undefined}
            onPackagesChanges={handlePackagesChange}
          />
        </div>

        <div style={{ textAlign: "right" }}>
          <Button loading={loading} icon={<PlusOutlined />} size="large" type="primary" htmlType="submit">
            Créer la commande
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default CreateOrderForm;

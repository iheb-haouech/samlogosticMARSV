import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Input, InputRef, Row, Select, message, Space, Card, Typography, Flex, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { Order, PackagesData } from "../../../../types/Order";
import PackageTable from "../../../organisms/Tables/PackageTable/PackageTable";
import "./CreateOrderForm.scss";
import { useTranslation } from "react-i18next";
import { ApiClientWithHeaders } from "../../../../api";

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

interface CreateAdminOrderFormProps {
  onCreateOrder: (order: Order) => void;
  currentUser: any;
  orderMeta: OrderMeta;
}

const CreateAdminOrderForm = ({ onCreateOrder, currentUser, orderMeta }: CreateAdminOrderFormProps) => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientTypeFilter, setClientTypeFilter] = useState<"B2B" | "B2C" | "all">("B2C");
  const [form] = Form.useForm();

  const initialFormValues: Order = {
    description: "",
    totalWeight: 0,
    totalQuantity: 0,
    totalPrice: null,
    clientPrice: null,
    transporterPrice: null,
    packages: [],
    refrences: [],
    createdByUserId: null,
    etd: null,
    eta: null,
    mainType: orderMeta.mainType,
    tradeType: orderMeta.tradeType,
    transportType: orderMeta.transportType,
    subType: orderMeta.subType,
    otherMessage: orderMeta.otherMessage,
    recipient: {
      companyName: currentUser?.companyName || "",
      phone: currentUser?.phone || "",
      city: currentUser?.city || "",
      country: currentUser?.country || "",
      streetAddress: currentUser?.address || "",
      secondAddress: "",
      zipCode: currentUser?.zipCode || "",
      email: currentUser?.email || "",
    },
    source: {
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

  const [formValues, setFormValues] = useState<Order>(initialFormValues);
  const [tags, setTags] = useState<string[]>([]);
  const [packagesData, setPackagesData] = useState<PackagesData>({ packages: [], totalQuantity: 0 });
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible && inputRef.current) inputRef.current.focus();
  }, [inputVisible]);

  const getClientsForType = async (type: "B2B" | "B2C" | "all") => {
    const token: any = localStorage.getItem("accessToken");
    const myClient = ApiClientWithHeaders(token);
    const params: any = { page: 1, limit: 100 };
    if (type !== "all") {
      params.accountType = type;
    }
    const response = await myClient.user.userControllerFindAllProviders(params as any);
    return (response.data as any)?.providers || [];
  };

  useEffect(() => {
    const loadClients = async () => {
      const list = await getClientsForType(clientTypeFilter);
      setProviders(list);
    };
    loadClients();
  }, [clientTypeFilter]);

  useEffect(() => {
    if (orderMeta.tradeType === "import" || orderMeta.tradeType === "export") {
      setClientTypeFilter("B2B");
    } else if (orderMeta.mainType === "national") {
      setClientTypeFilter("B2C");
    }
  }, [orderMeta]);

  const handleClientSelect = (value: any) => {
    const selected = providers.find((p: any) => p.id === value);
    if (!selected) return;
    setSelectedClient(selected);
    const updatedValues: any = { ...formValues, createdByUserId: selected.id };
    updatedValues.source = {
      companyName: selected.companyName || "",
      phone: selected.phone || "",
      city: selected.city || "",
      country: selected.country || "",
      streetAddress: selected.address || "",
      secondAddress: "",
      zipCode: selected.zipCode || "",
      email: selected.email || "",
    };
    setFormValues(updatedValues);
    form.setFieldsValue(updatedValues);
  };

  const handleSubmit = () => {
    if (!formValues.createdByUserId) {
      message.error("Veuillez choisir le client.");
      return;
    }
    if (
      selectedClient?.accountType === "B2C" &&
      packagesData?.packages.some((pkg) => !pkg.price || pkg.price <= 0)
    ) {
      message.error("Veuillez saisir le prix de chaque colis.");
      return;
    }

    const newOrderToSend: Order = {
      ...formValues,
      refrences: tags,
      totalWeight: packagesData?.totalWeight || 0,
      totalQuantity: packagesData?.totalQuantity || 0,
      packages: packagesData?.packages.map(({ index, ...pakg }: any) => pakg),
      totalPrice:
        selectedClient?.accountType === "B2C"
          ? packagesData?.packages.reduce(
              (total, pkg) => total + Number(pkg.price || 0) * Number(pkg.quantity || 1),
              0,
            )
          : formValues.totalPrice,
      shipmentPrice: selectedClient?.accountType === "B2C" && orderMeta.subType === "envoieLegere" ? 7 : formValues.shipmentPrice,
    };

    onCreateOrder(newOrderToSend);
  };

  const handlePackagesChange = (newPackagesData: PackagesData) => {
    setPackagesData(newPackagesData);
    setFormValues((prev) => ({
      ...prev,
      totalQuantity: newPackagesData.totalQuantity || 0,
    }));
  };

  const handleNestedFieldsChange =
    (field: "source" | "recipient", nestedField: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: { ...prev[field], [nestedField]: event.target.value },
      }));
    };

  const handleTagClose = (removedTag: string) => setTags(tags.filter((tag) => tag !== removedTag));
  const handleReferenceInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) setTags([...tags, inputValue]);
    setInputVisible(false);
    setInputValue("");
  };
  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const handleClientTypeChange = (val: any) => {
    setClientTypeFilter(val);
    setSelectedClient(null);
    form.setFieldsValue({ createdByUserId: undefined });
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" size="middle">
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={12} align="middle">
          <Col>
            <Typography.Text strong>Type de client:</Typography.Text>
          </Col>
          <Col>
            <Select
              size="small"
              value={clientTypeFilter}
              onChange={handleClientTypeChange}
              style={{ width: 140 }}
              options={[
                { value: "B2B", label: "B2B" },
                { value: "B2C", label: "B2C" },
                { value: "all", label: "Tous" },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ marginBottom: 12 }}>
          {t("for")}
        </Title>
        <Select
          showSearch
          placeholder="Sélectionner un client..."
          optionFilterProp="children"
          onChange={handleClientSelect}
          value={selectedClient?.id}
          filterOption={(input, option: any) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          style={{ width: "100%" }}
          size="large"
        >
          {providers.map((client) => (
            <Select.Option key={client.id} value={client.id} label={client.email}>
              <Space>
                {client.companyName || client.email}
                <Tag color={client.accountType === "B2B" ? "blue" : client.accountType === "B2C" ? "green" : "default"}>
                  {client.accountType || "B2C"}
                </Tag>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Card>

      {selectedClient && (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text type="secondary">Client sélectionné:</Typography.Text>
              <br />
              <Typography.Text strong>{selectedClient.companyName || selectedClient.email}</Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text type="secondary">Ville:</Typography.Text>
              <br />
              <Typography.Text strong>{selectedClient.city || "-"}</Typography.Text>
            </Col>
          </Row>
        </Card>
      )}

      <Card size="small" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ marginBottom: 12 }}>Expéditeur (source)</Title>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item label="Société" name={["source", "companyName"]} rules={[{ required: true }]}>
              <Input placeholder="Société expéditrice" onChange={handleNestedFieldsChange("source", "companyName")} value={formValues.source.companyName} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ville" name={["source", "city"]} rules={[{ required: true }]}>
              <Input placeholder="Ville" onChange={handleNestedFieldsChange("source", "city")} value={formValues.source.city} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Téléphone" name={["source", "phone"]}>
              <Input placeholder="+216 XX XXX XXX" onChange={handleNestedFieldsChange("source", "phone")} value={formValues.source.phone} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Adresse" name={["source", "streetAddress"]}>
              <Input placeholder="Adresse" onChange={handleNestedFieldsChange("source", "streetAddress")} value={formValues.source.streetAddress} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Code postal" name={["source", "zipCode"]}>
              <Input placeholder="XXXX" onChange={handleNestedFieldsChange("source", "zipCode")} value={formValues.source.zipCode} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ marginBottom: 12 }}>Destinataire</Title>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item label="Société" name={["recipient", "companyName"]} rules={[{ required: true, message: "Requis" }]}>
              <Input placeholder="Société destinataire" onChange={handleNestedFieldsChange("recipient", "companyName")} value={formValues.recipient.companyName} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ville" name={["recipient", "city"]} rules={[{ required: true, message: "Requis" }]}>
              <Input placeholder="Ville" onChange={handleNestedFieldsChange("recipient", "city")} value={formValues.recipient.city} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Téléphone" name={["recipient", "phone"]}>
              <Input placeholder="+216 XX XXX XXX" onChange={handleNestedFieldsChange("recipient", "phone")} value={formValues.recipient.phone} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Adresse" name={["recipient", "streetAddress"]}>
              <Input placeholder="Adresse" onChange={handleNestedFieldsChange("recipient", "streetAddress")} value={formValues.recipient.streetAddress} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Code postal" name={["recipient", "zipCode"]}>
              <Input placeholder="XXXX" onChange={handleNestedFieldsChange("recipient", "zipCode")} value={formValues.recipient.zipCode} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ marginBottom: 12 }}>Détails de la commande</Title>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item label="Description">
              <Input.TextArea
                rows={2}
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                placeholder="Description optionnelle..."
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Références">
              <Flex gap="4px" wrap>
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
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Colis"
          rules={[() => ({
            validator: async () => {
              if (packagesData.packages && packagesData.packages.length > 0) return;
              return Promise.reject(new Error("Ajoutez au moins un colis."));
            },
          })]}
        >
          <PackageTable
            packages={packagesData.packages}
            showPrice={selectedClient?.accountType === "B2C"}
            fixedShipmentPrice={selectedClient?.accountType === "B2C" && orderMeta.subType === "envoieLegere" ? 7 : undefined}
            onPackagesChanges={handlePackagesChange}
          />
        </Form.Item>
      </Card>

      <div style={{ textAlign: "right", marginTop: 8 }}>
        <Button icon={<PlusOutlined />} size="large" type="primary" htmlType="submit" shape="round">
          Créer la commande
        </Button>
      </div>
    </Form>
  );
};

export default CreateAdminOrderForm;

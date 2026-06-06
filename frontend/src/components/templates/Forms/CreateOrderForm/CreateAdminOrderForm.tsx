import { useEffect, useRef, useState } from "react";
import { Button, Col, Divider, Flex, Form, Input, InputRef, Row, Select, Tag, message } from "antd";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { Order, PackagesData } from "../../../../types/Order";
import PackageTable from "../../../organisms/Tables/PackageTable/PackageTable";
import "./CreateOrderForm.scss";
import { useSelector } from "react-redux";
import { selectLoadingState, setLoading } from "../../../../features/loading/loadingSlice";
import { store } from "../../../../store/store";
import { useTranslation } from "react-i18next";
import { ApiClientWithHeaders } from "../../../../api";
import { primaryColor } from "../../../../globalVar/colors";

interface OrderMeta {
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
}

interface CreateAdminOrderFormProps {
  onCreateOrder: (order: Order) => void;
  currentUser: any;
  orderMeta: OrderMeta;
}

const CreateAdminOrderForm = ({ onCreateOrder, currentUser, orderMeta }: CreateAdminOrderFormProps) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const { t } = useTranslation();
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
  const loading = useSelector(selectLoadingState);
  const [tags, setTags] = useState<string[]>([]);
  const [packagesData, setPackagesData] = useState<PackagesData>({ packages: [], totalQuantity: 0 });
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  const getProviders = async () => {
    const token: any = localStorage.getItem("accessToken");
    const myClient = ApiClientWithHeaders(token);
    const response = await myClient.user.userControllerFindAllProviders({
      page: 1,
      limit: 12,
      verified: true,
    } as any);
    return response.data;
  };

  const onSearch = async () => {
    const response: any = await getProviders();
    setProviders(response?.providers || []);
  };

  const handleProviderSelect = (value: any) => {
    const selected = providers.find((provider) => provider.id === value);
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

  useEffect(() => {
    setFormValues((prev) => ({ ...prev, refrences: tags, packages: packagesData.packages }));
  }, [packagesData, tags]);

  const handleSubmit = () => {
    if (!formValues.createdByUserId) {
      message.error("Veuillez choisir le client lie a cette commande.");
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
setFormValues((prev) => ({
  ...prev,
  totalQuantity: newPackagesData.totalQuantity || 0,
}));  };

  const handleNestedFieldsChange =
    (field: "source" | "recipient", nestedField: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: { ...prev[field], [nestedField]: event.target.value },
      }));
    };

  useEffect(() => {
    if (inputVisible && inputRef.current) inputRef.current.focus();
  }, [inputVisible]);

  const handleTagClose = (removedTag: string) => setTags(tags.filter((tag) => tag !== removedTag));

  const handleReferenceInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) setTags([...tags, inputValue]);
    setInputVisible(false);
    setInputValue("");
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const getSearchInput = () => (
    <div className='order-form--partners'>
      <div
        className='order-form--partners-header'
        style={{ display: "flex", flexDirection: "row", alignItems: "center", border: `2px solid ${primaryColor}`, borderRadius: 5 }}
      >
        <Title style={{ margin: "1rem" }} level={5}>{t("for")}</Title>
        <Select
          showSearch
          placeholder={t("Search_by_email")}
          optionFilterProp='children'
          onSearch={onSearch}
          onSelect={handleProviderSelect}
          filterOption={(input, option: any) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          style={{ width: 200, minWidth: "290px" }}
        >
          {providers.map((provider) => (
            <Select.Option key={provider.id} value={provider.id} label={provider.email}>
              {provider.email}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <Form form={form} style={{ marginTop: "0.5rem" }} onFinish={handleSubmit} layout='vertical' size='large' initialValues={formValues}>
      {getSearchInput()}
      <div className='order-form'>
        <div className='order-form--partners'>
          <div className='order-form--partners-header'>
            <Title style={{ margin: "1rem" }} level={5}>{t("supplier2")}</Title>
            <Divider className='order-form--partners-header-divider' />
          </div>
          <div className='order-form--partners-content'>
            <Row gutter={16}>
              <Col className='gutter-row' flex={1}>
                <Form.Item label={t("company_name")} name={["source", "companyName"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input placeholder={t("company_name")} onChange={handleNestedFieldsChange("source", "companyName")} value={formValues.source.companyName} />
                </Form.Item>
              </Col>
              <Col className='gutter-row' flex={1}>
                <Form.Item label={t("phone_number")} name={["source", "phone"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input type='number' placeholder={t("phone_number")} onChange={handleNestedFieldsChange("source", "phone")} value={formValues.source.phone} />
                </Form.Item>
              </Col>
              <Col className='gutter-row' flex={1}>
                <Form.Item label={t("city")} name={["source", "city"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input placeholder={t("city")} onChange={handleNestedFieldsChange("source", "city")} value={formValues.source.city} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex={2}>
                <Form.Item label={t("street_address")} name={["source", "streetAddress"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input placeholder={t("street_address")} onChange={handleNestedFieldsChange("source", "streetAddress")} value={formValues.source.streetAddress} />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item label={t("zip_code")} name={["source", "zipCode"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input placeholder={t("zip_code")} onChange={handleNestedFieldsChange("source", "zipCode")} value={formValues.source.zipCode} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        <div className='order-form--partners'>
          <div className='order-form--partners-header'>
            <Title style={{ margin: "1rem" }} level={5}>{t("destination")}</Title>
            <Divider className='order-form--partners-header-divider' />
          </div>
          <div className='order-form--partners-content'>
            <Row gutter={16}>
              <Col className='gutter-row' flex={1}>
                <Form.Item label={t("recipient_name")} name={["recipient", "companyName"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input placeholder={t("recipient_name")} onChange={handleNestedFieldsChange("recipient", "companyName")} value={formValues.recipient.companyName} />
                </Form.Item>
              </Col>
              <Col className='gutter-row' flex={1}>
                <Form.Item label={t("phone_number")} name={["recipient", "phone"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input type='number' placeholder={t("phone_number")} onChange={handleNestedFieldsChange("recipient", "phone")} value={formValues.recipient.phone} />
                </Form.Item>
              </Col>
              <Col className='gutter-row' flex={1}>
                <Form.Item label={t("city")} name={["recipient", "city"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input placeholder={t("city")} onChange={handleNestedFieldsChange("recipient", "city")} value={formValues.recipient.city} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex={2}>
                <Form.Item label={t("street_address")} name={["recipient", "streetAddress"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input placeholder={t("street_address")} onChange={handleNestedFieldsChange("recipient", "streetAddress")} value={formValues.recipient.streetAddress} />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item label={t("zip_code")} name={["recipient", "zipCode"]} rules={[{ required: true, message: t("Required field") }]}>
                  <Input placeholder={t("zip_code")} onChange={handleNestedFieldsChange("recipient", "zipCode")} value={formValues.recipient.zipCode} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        <section>
          <div className='order-form--description'>
            <Form.Item name='description' label={t("order_description")}>
              <Input.TextArea rows={4} value={formValues.description} onChange={(event) => setFormValues({ ...formValues, description: event.target.value })} placeholder={t("order_description")} />
            </Form.Item>
          </div>
          <div className='order-form--references'>
            <Form.Item name='refrences' label={t("add_references")}>
              <Flex className='order-form--references-container' gap='4px 0' wrap='wrap'>
                {tags.map((tag, index) => (
                  <Tag key={index} closable onClose={() => handleTagClose(tag)}>{tag}</Tag>
                ))}
                {inputVisible ? (
                  <Input ref={inputRef} type='text' size='small' value={inputValue} onChange={handleReferenceChange} onBlur={handleReferenceInputConfirm} onPressEnter={handleReferenceInputConfirm} />
                ) : (
                  <Tag onClick={() => setInputVisible(true)} icon={<PlusOutlined />}>{t("add_reference")}</Tag>
                )}
              </Flex>
            </Form.Item>
          </div>
          <div className='order-form--package-table'>
            <Form.Item name={'packages'} rules={[() => ({ validator() { if (formValues.packages && formValues.packages.length > 0) return Promise.resolve(); return Promise.reject(new Error(t("add_packages"))); } })]}>
              <PackageTable
                packages={packagesData.packages}
                showPrice={selectedClient?.accountType === "B2C"}
                fixedShipmentPrice={selectedClient?.accountType === "B2C" && orderMeta.subType === "envoieLegere" ? 7 : undefined}
                onPackagesChanges={handlePackagesChange}
              />
            </Form.Item>
          </div>
        </section>
        <div className='order-form--submit-btn' style={{ marginTop: '1.5rem' }}>
          <Button loading={loading} icon={<PlusOutlined />} size='large' type='primary' htmlType='submit' shape='round'>{t('submit_order')}</Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateAdminOrderForm;

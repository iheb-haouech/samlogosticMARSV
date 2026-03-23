import { useEffect, useRef, useState } from "react";
import { Button, Col, DatePicker, Divider, Flex, Form, Input, InputRef, Row, Select, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { Order, OrderType, PackagesData } from "../../../../types/Order";
import PackageTable from "../../../organisms/Tables/PackageTable/PackageTable";
import "./CreateOrderForm.scss";
import { useSelector } from "react-redux";
import { selectLoadingState, setLoading } from "../../../../features/loading/loadingSlice";
import { store } from "../../../../store/store";
import { useTranslation } from "react-i18next";
import { ApiClientWithHeaders } from "../../../../api";
import { primaryColor } from "../../../../globalVar/colors";
import dayjs from "dayjs";

interface CreateOrderFormProps {
  onCreateOrder: (Order: Order) => void;
  orderType: OrderType;
  currentUser: any;
}

const CreateAdminOrderForm = ({ orderType, onCreateOrder, currentUser }: CreateOrderFormProps) => {
  const [providers, setProviders] = useState<any[]>([]);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const initialFormValues =
    orderType === "deliverOrder"
      ? {
          description: null,
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
          source: {
            email: currentUser?.email,
            companyName: currentUser?.companyName,
            phone: currentUser?.phone,
            city: currentUser?.city,
            country: currentUser?.country,
            streetAddress: currentUser?.address,
            secondAddress: "",
            zipCode: currentUser?.zipCode,
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
        }
      : {
          description: null,
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
          recipient: {
            email: currentUser?.email,
            companyName: currentUser?.companyName,
            phone: currentUser?.phone,
            city: currentUser?.city,
            country: currentUser?.country,
            streetAddress: currentUser?.address,
            secondAddress: "",
            zipCode: currentUser?.zipCode,
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

  const [formValues, setFormValues] = useState<Order | any>(initialFormValues);
  const loading = useSelector(selectLoadingState);
  const [tags, setTags] = useState<string[]>([]);
  const [packagesData, setPackagesData] = useState<PackagesData>({
    packages: [],
    totalQuantity: 0,
  });
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
    setProviders(response?.providers);
  };

  const handleProviderSelect = (value: any) => {
    const selected = providers.find((provider) => provider.id === value);

    const updatedValues = {
      ...formValues,
      createdByUserId: selected.id,
    };

    if (orderType === "deliverOrder") {
      updatedValues.source = {
        companyName: selected.companyName,
        phone: selected.phone,
        city: selected.city,
        country: selected.country,
        streetAddress: selected.address,
        secondAddress: "",
        zipCode: selected.zipCode,
        email: selected.email,
      };
    } else {
      updatedValues.recipient = {
        companyName: selected.companyName,
        phone: selected.phone,
        city: selected.city,
        country: selected.country,
        streetAddress: selected.address,
        secondAddress: "",
        zipCode: selected.zipCode,
        email: selected.email,
      };
    }

    setFormValues(updatedValues);
    form.setFieldsValue(updatedValues);
  };

  useEffect(() => {
    setFormValues((prevFormValues: any) => ({
      ...prevFormValues,
      refrences: tags,
      packages: packagesData.packages,
    }));
  }, [packagesData, tags]);

  const handleSubmit = () => {
    const newOrder: Order = {
      ...formValues,
      totalWeight: packagesData?.totalWeight || 0,
      totalQuantity: packagesData?.totalQuantity || 0,
      packages: packagesData?.packages?.map(({ index, ...pakg }) => pakg),
    };
    store.dispatch(setLoading(true));
    onCreateOrder(newOrder);
  };

  const handlePackagesChange = (newPackagesData: PackagesData) => {
    setPackagesData(newPackagesData);
    setFormValues((prevFormValues: any) => ({
      ...prevFormValues,
      totalQuantity: newPackagesData.totalQuantity,
    }));
  };

  const handleNestedFieldsChange =
    (field: "source" | "recipient", nestedField: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prevFormValues: any) => ({
        ...prevFormValues,
        [field]: {
          ...prevFormValues[field],
          [nestedField]: event.target.value,
        },
      }));
    };

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleTagClose = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag));
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

  const getSearchInput = () => {
    return (
      <>
        <div className='order-form--partners'>
          <div
            className='order-form--partners-header'
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              border: `2px solid ${primaryColor}`,
              borderRadius: 5,
            }}
          >
            <Title style={{ margin: "1rem" }} level={5}>
              {t("for")}
            </Title>
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
      </>
    );
  };

  return (
    <Form
      form={form}
      style={{ marginTop: "0.5rem" }}
      onFinish={handleSubmit}
      layout='vertical'
      size='large'
      initialValues={formValues}
    >
      {orderType == "deliverOrder" && getSearchInput()}
      <div className='order-form'>
        <div className='order-form--partners'>
          <div className='order-form--partners-header'>
            <Title style={{ margin: "1rem" }} level={5}>
              {t("supplier2")}
            </Title>
            <Divider className='order-form--partners-header-divider' />
          </div>
          <div className='order-form--partners-content'>
            <Row gutter={16}>
              <Col className='gutter-row' flex={1}>
                <Form.Item
                  label={t("company_name")}
                  name={["source", "companyName"]}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='sourceName'
                    placeholder={t("company_name")}
                    onChange={handleNestedFieldsChange("source", "companyName")}
                    value={formValues.source.companyName}
                    type='text'
                  />
                </Form.Item>
              </Col>
              <Col className='gutter-row' flex={1}>
                <Form.Item
                  name={["source", "phone"]}
                  label={t("phone_number")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='sourcePhoneNumber'
                    type='number'
                    placeholder={t("phone_number")}
                    onChange={handleNestedFieldsChange("source", "phone")}
                    value={formValues.source.phone}
                  />
                </Form.Item>
              </Col>
              <Col className='gutter-row' flex={1}>
                <Form.Item
                  name={["source", "city"]}
                  label={t("city")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='sourceCity'
                    placeholder={t("city")}
                    onChange={handleNestedFieldsChange("source", "city")}
                    value={formValues.source.city}
                    type='text'
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex={2}>
                <Form.Item
                  name={["source", "streetAddress"]}
                  label={t("street_address")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='sourceStreetAddress'
                    placeholder={t("street_address")}
                    onChange={handleNestedFieldsChange("source", "streetAddress")}
                    value={formValues.source.streetAddress}
                  />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item
                  name={["source", "zipCode"]}
                  label={t("zip_code")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='sourceZip'
                    placeholder={t("zip_code")}
                    onChange={handleNestedFieldsChange("source", "zipCode")}
                    value={formValues.source.zipCode}
                    type='text'
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        {orderType == "bringOrder" && getSearchInput()}
        <div className='order-form--partners'>
          <div className='order-form--partners-header'>
            <Title style={{ margin: "1rem" }} level={5}>
              {t("destination")}
            </Title>
            <Divider className='order-form--partners-header-divider' />
          </div>
          <div className='order-form--partners-content'>
            <Row gutter={16}>
              <Col className='gutter-row' flex={1}>
                <Form.Item
                  name={["recipient", "companyName"]}
                  label={t("recipient_name")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='destinationName'
                    placeholder={t("recipient_name")}
                    onChange={handleNestedFieldsChange("recipient", "companyName")}
                    value={formValues.recipient.companyName}
                  />
                </Form.Item>
              </Col>
              <Col className='gutter-row' flex={1}>
                <Form.Item
                  name={["recipient", "phone"]}
                  label={t("phone_number")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='destinationPhoneNumber'
                    type='number'
                    placeholder={t("phone_number")}
                    onChange={handleNestedFieldsChange("recipient", "phone")}
                    value={formValues.recipient.phone}
                  />
                </Form.Item>
              </Col>
              <Col className='gutter-row' flex={1}>
                <Form.Item
                  name={["recipient", "city"]}
                  label={t("city")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='destinationCity'
                    placeholder={t("city")}
                    onChange={handleNestedFieldsChange("recipient", "city")}
                    value={formValues.recipient.city}
                    type='text'
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex={2}>
                <Form.Item
                  name={["recipient", "streetAddress"]}
                  label={t("street_address")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='destinationStreetAddress'
                    placeholder={t("street_address")}
                    onChange={handleNestedFieldsChange("recipient", "streetAddress")}
                    value={formValues.recipient.streetAddress}
                    type='text'
                  />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item
                  name={["recipient", "zipCode"]}
                  label={t("zip_code")}
                  rules={[
                    {
                      required: true,
                      message: t("Required field"),
                    },
                  ]}
                >
                  <Input
                    id='destinationZip'
                    placeholder={t("zip_code")}
                    onChange={handleNestedFieldsChange("recipient", "zipCode")}
                    value={formValues.recipient.zipCode}
                    type='text'
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        <section>
          <div className='order-form--description'>
            <Form.Item name='description' label={t("order_description")}>
              <Input.TextArea
                id='description'
                value={formValues.description}
                onChange={(event) => setFormValues({ ...formValues, description: event.target.value })}
                rows={4}
                placeholder={t("order_description")}
              />
            </Form.Item>
          </div>
          <div className='order-form--partners-content'>
            <Form.Item name='refrences' label={t("add_references")}>
              <Flex className='order-form--references-container' gap='4px 0' wrap='wrap'>
                {tags.map((tag, index) => (
                  <Tag
                    className='order-form--references-container--tag'
                    key={index}
                    closable={true}
                    onClose={() => handleTagClose(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
                {inputVisible ? (
                  <Input
                    className='order-form--references-container--input'
                    ref={inputRef}
                    type='text'
                    size='small'
                    value={inputValue}
                    onChange={handleReferenceChange}
                    onBlur={handleReferenceInputConfirm}
                    onPressEnter={handleReferenceInputConfirm}
                  />
                ) : (
                  <Tag
                    className='order-form--references-container--new-tag'
                    onClick={() => setInputVisible(true)}
                    icon={<PlusOutlined />}
                  >
                    {t("add_reference")}
                  </Tag>
                )}
              </Flex>
            </Form.Item>
          </div>

          {/** ETA & ETD */}
          <div className='order-form--partners'>
            <div className='order-form--partners-header'>
              <Title style={{ margin: "1rem" }} level={5}>
                {t("etaetd")}
              </Title>
              <Divider className='order-form--partners-header-divider' />
            </div>
            <div
              className='order-form--partners-content'
              style={{ width: "100%", display: "flex", flexDirection: "row" }}
            >
              <div style={{ marginRight: 10 }}>
                <Form.Item name='etd' label={t("etd")}>
                  <DatePicker
                    id='etd'
                    format='YYYY-MM-DD'
                    value={formValues?.etd ? new Date(formValues?.etd) : null}
                    onChange={(dateString) => {
                      if (dateString) {
                        const formattedDate = dayjs(dateString).add(1, "day").toISOString();
                        setFormValues({
                          ...formValues,
                          etd: formattedDate,
                        });
                      }
                    }}
                    placeholder={t("etd")}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item name='eta' label={t("eta")}>
                  <DatePicker
                    id='eta'
                    format='YYYY-MM-DD'
                    value={formValues?.eta ? dayjs(formValues?.etd?.split("T")[0]) : null}
                    onChange={(dateString) => {
                      if (dateString) {
                        const formattedDate = dayjs(dateString).add(1, "hour").toISOString();
                        setFormValues({
                          ...formValues,
                          eta: formattedDate,
                        });
                      }
                    }}
                    placeholder={t("eta")}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='order-form--package-table'>
            <Form.Item
              name={"packages"}
              rules={[
                () => ({
                  validator() {
                    if (formValues.packages && formValues.packages.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(t("add_packages"));
                  },
                }),
              ]}
            >
              <PackageTable packages={packagesData.packages} onPackagesChanges={handlePackagesChange} />
            </Form.Item>
          </div>
        </section>
        <div className='order-form--submit-btn' style={{ marginTop: "1.5rem" }}>
          <Button loading={loading} icon={<PlusOutlined />} size='large' type='primary' htmlType='submit' shape='round'>
            {t("submit_order")}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateAdminOrderForm;

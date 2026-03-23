import { useEffect, useRef, useState } from "react";
import { Button, Col, Divider, Flex, Form, Input, InputRef, Row, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { Order, OrderType, PackagesData } from "../../../../types/Order";
import PackageTable from "../../../organisms/Tables/PackageTable/PackageTable";
import "./CreateOrderForm.scss";
import { useSelector } from "react-redux";
import { selectLoadingState, setLoading } from "../../../../features/loading/loadingSlice";
import { store } from "../../../../store/store";
import { useTranslation } from "react-i18next";
//import dayjs from "dayjs";

interface CreateOrderFormProps {
  onCreateOrder: (Order: Order) => void;
  orderType: OrderType;
  currentUser: any;
}

const CreateOrderForm = ({ orderType, onCreateOrder, currentUser }: CreateOrderFormProps) => {
  const { t } = useTranslation();
  let newOrder;
  switch (orderType) {
    case "deliverOrder":
      newOrder = {
        description: null,
        totalWeight: 0,
        totalQuantity: 0,
        totalPrice: null,
        clientPrice: null,
        transporterPrice: null,
        packages: [],
        refrences: [],
        //etd: null,
        //eta: null,
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
      };
      break;
    case "bringOrder":
      newOrder = {
        description: null,
        totalWeight: 0,
        totalQuantity: 0,
        totalPrice: null,
        clientPrice: null,
        transporterPrice: null,
        packages: [],
        refrences: [],
        //etd: null,
        //eta: null,
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
      break;
  }

  const [formValues, setFormValues] = useState<Order | any>(newOrder);
  const loading = useSelector(selectLoadingState);
  const [tags, setTags] = useState<string[]>([]);
  const [packagesData, setPackagesData] = useState<PackagesData>({
    packages: [],
    totalQuantity: 0,
  });
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  // Update FormValues if there is a change with packagesData or inputRefValue or tags
  useEffect(() => {
    setFormValues({
      ...formValues,
      refrences: tags,
      packages: packagesData.packages,
    });
  }, [packagesData, inputValue, tags]);

  const handleSubmit = () => {
    const newOrder: Order = {
      description: formValues?.description,
      source: {
        companyName: formValues?.source?.companyName,
        phone: formValues?.source?.phone,
        city: formValues?.source?.city,
        country: formValues?.source?.country,
        streetAddress: formValues?.source?.streetAddress,
        secondAddress: formValues?.source?.secondAddress,
        zipCode: formValues?.source?.zipCode,
        email: formValues?.source?.email,
      },
      recipient: {
        companyName: formValues?.recipient?.companyName,
        phone: formValues?.recipient?.phone,
        city: formValues?.recipient?.city,
        country: formValues?.recipient?.country,
        streetAddress: formValues?.recipient?.streetAddress,
        secondAddress: formValues?.recipient?.secondAddress,
        zipCode: formValues?.recipient?.zipCode,
        email: formValues?.recipient?.email,
      },
      refrences: tags,
      //etd: formValues?.etd,
      //eta: formValues?.eta,
      totalWeight: packagesData?.totalWeight || 0,
      totalQuantity: packagesData?.totalQuantity || 0,
      totalPrice: formValues?.totalPrice,
      clientPrice: formValues?.clientPrice,
      transporterPrice: formValues?.transporterPrice,
      packages: packagesData?.packages.map(({ index, ...pakg }: any) => pakg),
    };
    store.dispatch(setLoading(true));
    onCreateOrder(newOrder);
  };

  const handlePackagesChange = (newPackagesData: PackagesData) => {
    setPackagesData(newPackagesData);
    setFormValues({
      ...formValues,
      totalQuantity: newPackagesData?.totalQuantity,
    });
  };

  const handleNesteFieldsChange =
    (field: "source" | "recipient", nestedField: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [field]: {
          ...formValues[field],
          [nestedField]: event.target.value,
        },
      });
    };

  // Handle tags
  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const handleRefrenceInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleRefrenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Form
      style={{ marginTop: "0.5rem" }}
      onFinish={handleSubmit}
      layout='vertical'
      size='large'
      initialValues={formValues}
    >
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
                    onChange={handleNesteFieldsChange("source", "companyName")}
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
                    onChange={handleNesteFieldsChange("source", "phone")}
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
                    onChange={handleNesteFieldsChange("source", "city")}
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
                    onChange={handleNesteFieldsChange("source", "streetAddress")}
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
                    onChange={handleNesteFieldsChange("source", "zipCode")}
                    value={formValues.source.zipCode}
                    type='text'
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
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
                    onChange={handleNesteFieldsChange("recipient", "companyName")}
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
                    onChange={handleNesteFieldsChange("recipient", "phone")}
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
                    onChange={handleNesteFieldsChange("recipient", "city")}
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
                    onChange={handleNesteFieldsChange("recipient", "streetAddress")}
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
                    onChange={handleNesteFieldsChange("recipient", "zipCode")}
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
          <div className='order-form--references'>
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
                    onChange={handleRefrenceChange}
                    onBlur={handleRefrenceInputConfirm}
                    onPressEnter={handleRefrenceInputConfirm}
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
          {/** ETA & ETD
          <p>cccccccc {currentUser?.user?.roleId}</p>
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
                    value={null}
                    onChange={(dateString) => {
                      if (dateString) {
                        const formattedDate = dayjs(dateString).add(1, "hour").toISOString();
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
                    value={null}
                    onChange={(dateString) => {
                      if (dateString) {
                        const formattedDate = dayjs(dateString).add(1, "day").toISOString();
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
 */}
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

export default CreateOrderForm;

import { Avatar, Badge, Button, Card, Empty, Space, Steps, Table, Tag } from "antd";
import Title from "antd/es/typography/Title";
import "./OrderDetails.scss";
import {
  UserOutlined,
  DownloadOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  IssuesCloseOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import { HiOutlinePhone } from "react-icons/hi";
import { IoEyeOutline } from "react-icons/io5";
import { useState } from "react";
import { Order, OrderStatus } from "../../../types/Order";
import OrderStatusTag from "../../atoms/orderStatusTag/OrderStatusTag";
import formatDate from "../../../services/date";
import CreateComplaintModal from "../../molecules/Modals/CreateComplaintModal/CreateComplaintModal";
import { generateEtiquette } from "../../../services/generate_pdf";
import { useTranslation } from "react-i18next";
import { SyncOutlined } from "@ant-design/icons";
import { ApiClientWithHeaders } from "../../../api";
import { fetchOrders, updateOrder } from "../../../features/order/orderSlice";
import { store } from "../../../store/store";

interface OrderDetailsProps {
  order: Order;
  orderStatuses: OrderStatus[];
  addComplaint?: (values: any) => void;
  isAdmin: boolean;
}

const OrderInfo = ({ order, orderStatuses, addComplaint = () => {}, isAdmin }: OrderDetailsProps) => {
  const { t } = useTranslation();

  const downloadProofDelivery = (order: any) => {
    try {
      // Construct the URL for the file based on the order's file path
      const filePath = order?.pods && order?.pods?.length > 0 ? order?.pods[0]?.podUrl : null;
      const fileUrl = `${import.meta.env.VITE_BASE_URL}${filePath}`;

      // Open the file in a new tab or window
      window.open(fileUrl, "_blank");

      // Optionally, you can also log or alert to confirm the action
      console.log("File URL:", fileUrl);
    } catch (error) {
      console.error("Error downloading proof of delivery:", error);
      alert("Failed to download POD.");
    }
  };

  // @ts-ignore
  const [orderStatusId, setOrderStatusId] = useState(order?.orderStatusId);
  const [isCreateComplaintModaOpen, setIsCreateComplaintModaOpen] = useState(false);

  const uploadPOD = async (order: any) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("You must be logged in to upload a POD.");
        return;
      }

      // Create an input element to allow file selection
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/jpeg, image/png"; // Restrict file types to JPEG and PNG

      fileInput.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) {
          alert("No file selected! Please select a file to upload.");
          return;
        }

        // Check file size (max 1MB)
        if (file.size > 1 * 1024 * 1024) {
          alert("File size exceeds 1MB! Please select a smaller file.");
          return;
        }

        // Prepare the data object with order ID and file
        const data = {
          order_id: order.id, // Order ID
          file: file, // The file object
        };

        try {
          // Set up the API client with headers
          const apiClient = await ApiClientWithHeaders(accessToken);

          // Make the API request to upload the POD
          const response: any = await apiClient.uploadPod.uploadPodControllerUploadFile(data);

          if (!response?.data) {
            alert("Failed to upload POD. Please try again.");
          } else {
            store.dispatch(fetchOrders());
          }
        } catch (uploadError) {
          console.error("Error during POD upload:", uploadError);
          alert("An error occurred while uploading the POD. Please try again.");
        }
      };

      // Trigger the file input click event to open the file selector
      fileInput.click();
    } catch (error) {
      console.error("Error initializing POD upload:", error);
      alert("Failed to initialize POD upload. Please refresh and try again.");
    }
  };

  const getOrderPriceStatus = (status: any) => {
    switch (status) {
      // no action
      case 1:
        return <ExclamationCircleOutlined />;
      // in progress
      case 2:
        return <FieldTimeOutlined style={{ color: "#146af5" }} />;
      // confirmed
      case 3:
        return <CheckCircleOutlined style={{ color: "#39bf2a" }} />;
      // cancelled
      case 4:
        return <CloseCircleOutlined style={{ color: "#e82020" }} />;
      // error
      default:
        return <IssuesCloseOutlined />;
    }
  };

  const confirmClientPrice = (orderId: any) => {
    if (orderId) {
      store.dispatch(updateOrder({ id: orderId, clientPriceStatusId: 3 }));
    }
  };
  const cancelClientPrice = (orderId: any) => {
    if (orderId) {
      store.dispatch(updateOrder({ id: orderId, clientPriceStatusId: 4 }));
    }
  };
  const confirmTransporterPrice = (orderId: any) => {
    if (orderId) {
      store.dispatch(updateOrder({ id: orderId, transporterPriceStatusId: 3 }));
    }
  };
  const cancelTransporterPrice = (orderId: any) => {
    if (orderId) {
      store.dispatch(updateOrder({ id: orderId, transporterPriceStatusId: 4 }));
    }
  };

  return (
    <>
      <div className='order'>
        <Space direction='vertical' size='large' style={{ display: "flex" }}>
          <div className='order--status'>
            <Title style={{ marginTop: "1rem" }} level={5}>
              {t("deliveryInfo")}
            </Title>
            <Card>
              <Steps
                status={order?.orderStatusId - 1 == 4 ? "error" : order?.orderStatusId - 1 == 3 ? "finish" : "process"}
                current={order?.orderStatusId - 1}
                labelPlacement='vertical'
                items={_orderStatuses}
              />
            </Card>
          </div>
          <div className='order--delivering'>
            <div className='order--delivering-info'>
              <Title level={5}>{t("deliveryDetails")}</Title>
              <Card className='order-card'>
                <div className='order--delivering-info--head'>
                  <div>
                    <h3 className='order-title'>{t("trackingNumber")}</h3>
                    <Paragraph
                      ellipsis={{
                        expandable: true,
                        rows: 0.1,
                      }}
                      copyable
                    >
                      {order?.trackingId}
                    </Paragraph>
                  </div>
                  <div>
                    <h3 className='order-title'>{t("orderStatus")}</h3>
                    <OrderStatusTag orderStatusId={orderStatusId} orderStatuses={orderStatuses} />
                  </div>
                </div>
                <div>
                  <h3 className='order-title--date'>{t("dates")}</h3>
                  <div className='order--delivering-info--dates'>
                    <div className='order--delivering-info--dates-item'>
                      <h4 className='order-title'>{t("creationDate")}</h4>
                      <p>{formatDate(order?.createdAt)}</p>
                    </div>
                    <div className='order--delivering-info--dates-item'>
                      <h4 className='order-title'>{t("lastUpdateDate")}</h4>
                      <p>--</p>
                    </div>
                    {/** ETA & ETD */}
                    <div className='order--delivering-info--dates-item'>
                      <h4 className='order-title'>{t("etd")}</h4>
                      <p>{order?.etd ? order?.etd?.split("T")[0] : "--"}</p>
                    </div>
                    <div className='order--delivering-info--dates-item'>
                      <h4 className='order-title'>{t("eta")}</h4>
                      <p>{order?.eta ? order?.eta?.split("T")[0] : "--"}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className='order--delivering-person'>
              <Title level={5}>{t("deliveryPersonInfo")}</Title>
              <Card className='order-card'>
                {order?.deliveredByUserId ? (
                  <div className='order--delivering-person--container'>
                    <div className='order--delivering-person--container-left-section'>
                      <Avatar size={64} icon={<UserOutlined />} />
                      <div>
                        <h4>{order?.deliveredBy?.firstName + " " + order?.deliveredBy?.lastName}</h4>
                        {/* TODO: Add the delivery person's disponibility and image */}
                        <Badge key='green' color='green' text='Disponible' />
                      </div>
                    </div>
                    <div className='order--delivering-person--container-right-section'>
                      <div className='order--delivering-person--container-right-section-phone'>
                        <h4 className='order-title'>{t("phoneNumber")}</h4>

                        <div className='phone-number'>
                          <div className='phone-icon'>
                            <HiOutlinePhone />
                          </div>
                          <h3>{order?.deliveredBy?.phone}</h3>
                        </div>
                      </div>
                      <div>
                        <h4 className='order-title'>{t("vehicleType")}</h4>
                        <p>{order?.deliveredBy?.carType ? order?.deliveredBy?.carType?.typeName : "--"}</p>
                      </div>
                      <div>
                        <h4 className='order-title'>{t("vehicleNumber")}</h4>
                        <p>{order?.deliveredBy?.carNumber ? order?.deliveredBy?.carNumber : "--"}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Empty description={<span>{t("deliveryPersonNotAssigned")}</span>} />
                  </div>
                )}
              </Card>
            </div>
          </div>
          <div className='order--partners'>
            <Title level={5}>{t("supplierDetails")}</Title>

            <Card>
              <div className='order--partners--items'>
                <div>
                  <h4 className='order-title'>{t("companyName")}</h4>
                  <p>{order?.source?.companyName}</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("phoneNumber")}</h4>
                  <p>{order?.source?.phone}</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("postalCode")}</h4>
                  <p>{order?.source?.zipCode}</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("city")}</h4>
                  <p>{order?.source?.city}</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("address")}</h4>
                  <p>{order?.source?.streetAddress} </p>
                </div>
              </div>
            </Card>
          </div>
          <div className='order--partners'>
            <Title level={5}>{t("recipientDetails")}</Title>

            <Card>
              <div className='order--partners--items'>
                <div>
                  <h4 className='order-title'>{t("companyName")}</h4>
                  <p>{order?.recipient?.companyName}</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("phoneNumber")}</h4>
                  <p>{order?.recipient?.phone}</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("postalCode")}</h4>
                  <p>{order?.recipient?.zipCode}</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("city")}</h4>
                  <p>{order?.recipient?.city}</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("address")}</h4>
                  <p>{order?.recipient?.streetAddress}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className='order--partners'>
            <Title level={5}>{t("Totals")}</Title>

            <Card>
              <div className='order--partners--items'>
                <div>
                  <h4 className='order-title'>{t("total_weight")}</h4>
                  <p>{order?.totalWeight} Kg</p>
                </div>
                <div>
                  <h4 className='order-title'>{t("total_quantity")}</h4>
                  <p>{order?.totalQuantity} Colis</p>
                </div>
              </div>
            </Card>
          </div>
          <div className='order--details'>
            <Title level={5}>{t("orderDetails")}</Title>
            <Card>
              <div className='order--details-general'>
                <h2 className='order--details-title'>{t("order")} </h2>
                <div className='order--details-general-top-section'>
                  <div className='order--details-general-top-section-left'>
                    <div className='order--details-general-item'>
                      <h4 className='order-title'>{t("orderLabel")}</h4>
                      <div className='order--details-btns'>
                        <Button
                          type='text'
                          className='order--details-btns-download'
                          icon={<DownloadOutlined />}
                          size='middle'
                          onClick={() => generateEtiquette(order?.id!)}
                        />
                        <Button
                          className='order--details-btns-view'
                          type='primary'
                          icon={<IoEyeOutline />}
                          size='middle'
                          onClick={() => generateEtiquette(order?.id!)}
                        />
                      </div>
                    </div>
                    <div className='order--details-general-item'>
                      <h4 className='order-title'>{t("deliveryProof")}</h4>
                      <div className='order--details-btns'>
                        {order?.pods && order?.pods?.length > 0 ? (
                          <Button
                            type='text'
                            className='order--details-btns-download'
                            icon={<DownloadOutlined />}
                            size='middle'
                            onClick={() => downloadProofDelivery(order)}
                          >
                            {t("download")}
                          </Button>
                        ) : null}
                        {isAdmin && (
                          <Button
                            className='order--details-btns-view'
                            type='primary'
                            icon={<UploadOutlined />}
                            size='middle'
                            onClick={() => uploadPOD(order)}
                          >
                            {t("upload")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <>
                    <div className='order--details-general-top-section-right'>
                      {/* // clietn price */}
                      <div className='order--details-general-item'>
                        <h4 className='order-title' style={{ marginBottom: "0px" }}>
                          {t("clientPrice")}
                        </h4>
                        <div className='order--details-tags'>
                          {order?.clientPrice ? (
                            <>
                              <Space>
                                <h4 className='order-title' style={{ color: "red" }}>
                                  {order?.clientPrice} TND {getOrderPriceStatus(order?.clientPriceStatusId)}
                                </h4>
                                {order?.clientPriceStatusId && [1, 2].includes(order?.clientPriceStatusId) && (
                                  <>
                                    <Button
                                      icon={<CloseOutlined />}
                                      onClick={() => cancelClientPrice(order?.id)}
                                      type='default'
                                      danger
                                    />
                                    <Button
                                      icon={<CheckOutlined />}
                                      onClick={() => confirmClientPrice(order?.id)}
                                      type='primary'
                                    />
                                  </>
                                )}
                              </Space>
                            </>
                          ) : (
                            <Tag icon={<SyncOutlined spin />} color='warning'>
                              {t("processing")}
                            </Tag>
                          )}
                        </div>
                      </div>
                      {isAdmin && (
                        <>
                          {/* // transporter price */}
                          <div className='order--details-general-item'>
                            <h4 className='order-title' style={{ marginBottom: "0px" }}>
                              {t("transporterPrice")}
                            </h4>
                            <div className='order--details-tags'>
                              {order?.transporterPrice ? (
                                <>
                                  <Space>
                                    <h4 className='order-title' style={{ color: "red" }}>
                                      {order?.transporterPrice} TND{" "}
                                      {getOrderPriceStatus(order?.transporterPriceStatusId)}
                                    </h4>
                                    {order?.transporterPriceStatusId &&
                                      [1, 2].includes(order?.transporterPriceStatusId) && (
                                        <>
                                          <Button
                                            icon={<CloseOutlined />}
                                            onClick={() => cancelTransporterPrice(order?.id)}
                                            type='default'
                                            danger
                                          />
                                          <Button
                                            icon={<CheckOutlined />}
                                            onClick={() => confirmTransporterPrice(order?.id)}
                                            type='primary'
                                          />
                                        </>
                                      )}
                                  </Space>
                                </>
                              ) : (
                                <Tag icon={<SyncOutlined spin />} color='warning'>
                                  {t("processing")}
                                </Tag>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                </div>
                <div className='order--details'>
                  <h4 className='order-title'>{t("references")}</h4>
                  {order?.refrences?.map((tag: any, idx: any) => (
                    <Tag
                      bordered={false}
                      className='order-form--references-container--tag'
                      color='processing'
                      key={idx}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className='order--details'>
                  <h4 className='order-title'>{t("Description")}</h4>
                  <p>{order?.description ? order?.description : "--"}</p>
                </div>
              </div>

              <div className='order--details-packages'>
                <h2 className='order--details-title'>{t("packages")} </h2>
                <Table
                  bordered
                  dataSource={order?.packages}
                  columns={columns}
                  pagination={false}
                  rowKey='id'
                  summary={() => (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>
                          <b>Total</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <b>{order?.totalWeight} Kg</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        <Table.Summary.Cell index={3}></Table.Summary.Cell>
                        <Table.Summary.Cell index={4}></Table.Summary.Cell>
                        <Table.Summary.Cell index={5}>
                          <b>{order?.totalQuantity} Colis</b>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  )}
                />
              </div>
            </Card>
          </div>
          {!isAdmin && (
            <div className='order--complaint'>
              <Card>
                <div className='order--complaint-content'>
                  <h3 className='order--complaint-content-title'>{t("reportIssue")}</h3>
                  <Button onClick={() => setIsCreateComplaintModaOpen(true)} size='large' type='primary'>
                    {t("addComplaint")}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </Space>
      </div>

      {/* Create Complaint Modal */}

      <CreateComplaintModal
        isCreateComplaintModaOpen={isCreateComplaintModaOpen}
        onCreateComplaintModaClose={() => setIsCreateComplaintModaOpen(false)}
        createComplaint={(values: any) => {
        console.log("VALUES RECEIVED IN ORDER:", values); 
    addComplaint({
      subject: values.subject,
      orderId: order?.id, // ⚠️ IMPORTANT
      messages:  [
  {
    messageContent: values.messageContent || "",
  },
],
    });
          setIsCreateComplaintModaOpen(false);
        }}
      />
    </>
  );
};

export default OrderInfo;
export const _orderStatuses = [
  {
    title: <span style={{ fontWeight: "700" }}>Non suivi</span>,
    description: "En attente d'attribution à un livreur.",
  },
  {
    title: <span style={{ fontWeight: "700" }}>En attente</span>,
    description: "Attribuée à un livreur.",
  },
  {
    title: <span style={{ fontWeight: "700" }}>En transit</span>,
    description: "En cours de livraison.",
  },
  {
    title: <span style={{ fontWeight: "700" }}>Livré</span>,
    description: "Livraison terminée.",
  },
];

const columns: any[number][] = [
  {
    title: "ID",
    key: "number",
    render: (_: any, _record: any, index: any) => index + 1,
  },
  {
    title: "Poids (Kg)",
    dataIndex: "weight",
    key: "weight",
  },
  {
    title: "Longeur (CM)",
    dataIndex: "length",
    key: "length",
  },
  {
    title: "Largeur (CM)",
    dataIndex: "width",
    key: "width",
  },
  {
    title: "Hauteur (CM)",
    dataIndex: "height",
    key: "height",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
];

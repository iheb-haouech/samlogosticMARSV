import { useState } from "react";
import { triggerAlert } from "../../../Alert/alertModule";
import { Order } from "../../../types/Order";
import { apiClient } from "../../../api";
import { Button, Card, Form, Input, Steps } from "antd";
import Title from "antd/es/typography/Title";
import "./TrakingOrders.scss";
import { _orderStatuses } from "../../../components/templates/OrderDetails/OrderDetails";
import { useTranslation } from "react-i18next";

interface TrackOrderFormProps {
  displayLogo?: boolean;
}

export const TrackOrderForm = ({ displayLogo = true }: TrackOrderFormProps) => {
  const { t } = useTranslation();
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { trackingNumber: string }) => {
    setLoading(true);
    try {
      const response = await apiClient.orders.ordersControllerFindOrderStatus(values.trackingNumber);
      const data = response.data as Order;

      if (data) {
        setTrackedOrder(data);
        form.resetFields();
      } else {
        triggerAlert({
          type: "deleted",
          title: "Error",
          message: "Order not found. Please check your tracking number.",
        });
        setTrackedOrder(null);
      }
    } catch (error) {
      triggerAlert({
        type: "deleted",
        title: "Error",
        message: "An error occurred while fetching the order.",
      });
      setTrackedOrder(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className='auth-page--form'>
        <div className='auth-form' style={{ paddingBottom: 200 }}>
          {displayLogo && (
            <div className='auth-form--logo-container'>
              <img
                className='auth-form--logo'
                style={{ width: 250 }}
                src='./png/vanloglogo-bgwhite.png'
                alt='vanlog Logo'
              />
            </div>
          )}

          <Title className='auth-form--title' level={3}>
            {t("trackOrder")}
          </Title>

          <Form style={{ marginTop: "1rem" }} layout='vertical' size='large' onFinish={handleSubmit}>
            <Form.Item
              label={t("writeTrackNum")}
              name='trackingNumber'
              rules={[
                {
                  required: true,
                  message: t("requiredField"),
                },
              ]}
              hasFeedback
            >
              <Input id='trackingNumber' placeholder='Exemple: 123456789' type='text' />
            </Form.Item>

            <Button
              className='auth-form--submit-btn'
              block
              htmlType='submit'
              type='primary'
              shape='round'
              size={"large"}
              loading={loading}
            >
              {t("conf")}
            </Button>
          </Form>
          {trackedOrder && trackedOrder?.orderStatusId !== 5 && (
            <div className='order--status'>
              <Title style={{ marginTop: "1rem" }} level={4}>
                {t("deliveryInformation")}
              </Title>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                {trackedOrder?.startTransitAt ? (
                  <>
                    <p style={{ marginRight: "20px" }}>
                      <b>{t("etd")}</b>
                    </p>
                    <p>
                      {new Date(
                        new Date(trackedOrder?.startTransitAt as any).setDate(
                          new Date(trackedOrder?.startTransitAt as any).getDate(),
                        ),
                      ).toLocaleDateString("en-GB")}
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ marginRight: "20px" }}>
                      <b>{t("etd")}</b>
                    </p>
                    <p>
                      {new Date(
                        new Date(trackedOrder?.createdAt as any).setDate(
                          new Date(trackedOrder?.createdAt as any).getDate() + 1,
                        ),
                      ).toLocaleDateString("en-GB")}
                    </p>
                  </>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                {trackedOrder?.startTransitAt && !trackedOrder?.deliveredAt ? (
                  <>
                    <p style={{ marginRight: "20px" }}>
                      <b>{t("eta")}</b>
                    </p>
                    <p>
                      {new Date(
                        new Date(trackedOrder?.startTransitAt as any).setDate(
                          new Date(trackedOrder?.startTransitAt as any).getDate() + 2,
                        ),
                      ).toLocaleDateString("en-GB")}
                    </p>
                  </>
                ) : (
                  trackedOrder?.deliveredAt && (
                    <>
                      <p style={{ marginRight: "20px" }}>
                        <b>{t("eta")}</b>
                      </p>
                      <p>
                        {new Date(
                          new Date(trackedOrder?.deliveredAt as any).setDate(
                            new Date(trackedOrder?.deliveredAt as any).getDate(),
                          ),
                        ).toLocaleDateString("en-GB")}
                      </p>
                    </>
                  )
                )}
              </div>
              <Card>
                <Steps
                  status={
                    trackedOrder?.orderStatusId - 1 == 4
                      ? "error"
                      : trackedOrder?.orderStatusId - 1 == 3
                        ? "finish"
                        : "process"
                  }
                  current={trackedOrder?.orderStatusId - 1}
                  labelPlacement='vertical'
                  direction='vertical'
                  items={_orderStatuses}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

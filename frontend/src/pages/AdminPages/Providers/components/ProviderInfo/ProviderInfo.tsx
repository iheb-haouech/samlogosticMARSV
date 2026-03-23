import React, { useEffect, useState } from "react";
import "./Providers.scss";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ApiClientWithHeaders } from "../../../../../api";
import ProvidersOrdersDataTable from "./ProvidersOrdersDataTable";
import { store } from "../../../../../store/store";
import { fetchOrderStatuses } from "../../../../../features/order/orderSlice";
import { useTranslation } from "react-i18next";

const ProviderInfo: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();
  const [provider, setProvider]: any = useState(null);
  const token: any = localStorage.getItem("accessToken");
  const myClient = ApiClientWithHeaders(token);
  useEffect(() => {
    const getProvider = async () => {
      const resp = await myClient.user.userControllerFindOne(id);
      const providerData = await resp?.data;
      setProvider(providerData);
    };
    id && getProvider();
  }, [id]);
  useEffect(() => {
    store.dispatch(fetchOrderStatuses());
  }, []);
  return (
    <>
      <div className='transporter-info-section'>
        <div className='with-avatar'>
          <Avatar size={64} icon={<UserOutlined />} />{" "}
          <div className='info-item'>
            <span className='name'>{provider?.email}</span>
            {/* <span>Disponible</span> */}
            <span>{provider?.phone}</span>
          </div>
        </div>
        <div className='info-section'>
          <div className='info-item'>
            <span className='title'>{t("patent")}</span>
            <span>{provider?.patent ? provider?.patent : "--"}</span>
          </div>
        </div>
        <div className='info-section'>
          <div className='info-item'>
            <span className='title'>{t("vehicle_type")}</span>
            <span>{provider?.carTypeId ? provider?.carTypeId : "--"}</span>
          </div>
        </div>
        <div className='info-section'>
          <div className='info-item'>
            <span className='title'>{t("vehicle_number")}</span>
            <span>{provider?.carNumber ? provider?.carNumber : "--"}</span>
          </div>
        </div>
      </div>
      <div className='Orders-delivered-section'>
        <ProvidersOrdersDataTable orders={provider?.createOrders} />
      </div>
    </>
  );
};

export default ProviderInfo;

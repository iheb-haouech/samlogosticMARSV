import React, { useEffect, useState } from "react";
import "./../../../Providers/components/ProviderInfo/Providers.scss";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import TransporterOrdersDataTable from "./TransporterOrdersDataTable";
import { ApiClientWithHeaders } from "../../../../../api";
import { useTranslation } from "react-i18next";

const TransporterInfo: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();

  const [transporter, setTransporter] = useState<any>(null);
  const token: any = localStorage.getItem("accessToken");
  const myClient = ApiClientWithHeaders(token);
  useEffect(() => {
    // TODO it should managed in the stor not here and hander th errors
    const getTransporter = async () => {
      const resp = await myClient.transporters.transportersControllerFindOne(id);
      const transporterData = resp.data;
      setTransporter(transporterData);
    };
    id && getTransporter();
  }, [id]);
  return (
    <>
      <div className='transporter-info-section'>
        <div className='with-avatar'>
          <Avatar size={64} icon={<UserOutlined />} />{" "}
          <div className='info-item'>
            <span className='name'>
              {transporter?.firstName ? transporter?.firstName : "--"} {transporter?.lastName}
            </span>
            <span>
              {t("email")} : {transporter?.email ? transporter?.email : "--"}
            </span>
            {/* <span>Disponible</span> */}
            <span>
              {t("phone")} : {transporter?.phone ? transporter?.phone : "--"}
            </span>
          </div>
        </div>
        <div className='info-section'>
          <div className='info-item'>
            <span className='title'>{t("patent")}</span>
            <span>{transporter?.patent ? transporter?.patent : "--"}</span>
          </div>
          <div className='info-item'>
            <span className='title'>{t("length")}</span>
            <span>{transporter?.carWidth ? transporter?.carWidth : "--"}</span>
          </div>
        </div>
        <div className='info-section'>
          <div className='info-item'>
            <span className='title'>{t("height")}</span>
            <span>{transporter?.carHeight ? transporter?.carHeight : "--"}</span>
          </div>
          <div className='info-item'>
            <span className='title'>{t("vehicle_type")}</span>
            <span>{transporter?.carType?.typeName ? transporter?.carType?.typeName : "--"}</span>
          </div>
        </div>

        <div className='info-section'>
          <div className='info-item'>
            <span className='title'>{t("vehicle_number")}</span>
            <span>{transporter?.carNumber ? transporter?.carNumber : "--"}</span>
          </div>
        </div>
      </div>
      <div className='Orders-delivered-section'>
        <TransporterOrdersDataTable orders={transporter?.deliverOrders} />
      </div>
    </>
  );
};

export default TransporterInfo;

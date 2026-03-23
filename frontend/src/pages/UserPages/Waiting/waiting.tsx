// Waiting.tsx
import React from "react";
import "./Waiting.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

const Waiting: React.FC = () => {
  const { t } = useTranslation();

  const currentUser: any = useSelector(selectCurrentUser);
  console.log(currentUser, "currentUser");

  const handelLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "login";
    window.location.reload();
  };

  return (
    <div className='waiting-page'>
      <img className='waiting-page--image' src='./png/waitingImage.png' alt='vanlog Logo' />

      <div className='waiting-description'>
        <div className='content'>
          <img
            className='auth-form--logo'
            style={{ width: 250 }}
            src='./png/vanloglogo-bgwhite.png'
            alt='vanlog Logo'
          />
          <h1 className='waiting-title'>{t("approval")}</h1>
          <p>
            Hello <span className='user-name'>{currentUser?.email}</span>, {t("approvalMsg")}
          </p>
          <Button type='primary' style={{ padding: 10 }} onClick={handelLogOut}>
            {t("approvalBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Waiting;

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { store } from "../../../store/store";
import { resetPassword, selectIsResetPsw } from "../../../features/auth/authSlice";
import { ResetPasswordDto } from "../../../api/myApi";
import { useSelector } from "react-redux";
const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isResetPsw = useSelector(selectIsResetPsw);

  const searchParams = new URLSearchParams(location.search);
  const resetPasswordToken = searchParams.get("token");
  useEffect(() => {
    // Check if reset password token is missing and redirect to login if needed
    if (!resetPasswordToken) {
      navigate("/login");
    }
  }, [resetPasswordToken, navigate]);

  const [resetPsw, setResetPsw] = useState({ newPassword: "", confirmNewPassword: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confPasswordVisible, setConfPasswordVisible] = useState(false);

  const handleChange = (filed: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetPsw({ ...resetPsw, [filed]: event.target.value });
  };

  const handleSubmit = () => {
    const data: ResetPasswordDto = {
      newPassword: resetPsw.newPassword,
      resetPasswordToken: resetPasswordToken!,
    };

    store.dispatch(resetPassword(data));
  };
  useEffect(() => {
    if (isResetPsw) {
      navigate("/login");
    }
  }, [isResetPsw, navigate]);
  return (
    <div className='auth-page'>
      <img className='auth-page--image' src='/png/loginImage.png' alt='login Image' />
      <div className='auth-page--form'>
        <div className='auth-form'>
          <img
            className='auth-form--logo'
            style={{ width: 250 }}
            src='/png/logoslogan.png'
            alt='SAM LOGISTIC logo'
          />
          <Title className='auth-form--title' level={3}>
            {t("changePasswordTitle")}
          </Title>
          <div className='auth-form--title-sub'>
            {t("enterNewPasswordMsg")}
          </div>

          <Form onFinish={handleSubmit} style={{ marginTop: "1rem" }} layout='vertical' size='large'>
            <Form.Item
              label={t("Password")}
              name='password'
              rules={[
                {
                  required: true,
                  message: t("passwordRequired"),
                },
              ]}
              hasFeedback
            >
              <Input.Password
                id='newPassword'
                placeholder={t("passwordPlaceholder")}
                onChange={handleChange("newPassword")}
                value={resetPsw.newPassword}
                type='password'
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
              />
            </Form.Item>
            <Form.Item
              label={t("confirmPassword")}
              name='confirmPassword'
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(t("The entered passwords do not match."));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                id='confirmNewPassword'
                placeholder={t("confirmPasswordPlaceholder")}
                onChange={handleChange("confirmNewPassword")}
                value={resetPsw.confirmNewPassword}
                type='password'
                visibilityToggle={{ visible: confPasswordVisible, onVisibleChange: setConfPasswordVisible }}
              />
            </Form.Item>
            <Button
              className='auth-form--submit-btn'
              block
              htmlType='submit'
              type='primary'
              shape='round'
              size={"large"}
            >
              {t("confirmButton")}
            </Button>
          </Form>
          <Typography.Text className='auth-form--text'>
            {t("rememberPassword")}{" "}
            <Typography.Link
              className='auth-form--textLink'
              onClick={() => {
                navigate("/login");
              }}
            >
              {t("Log in")}
            </Typography.Link>
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

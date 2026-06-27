import React, { useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import Title from "antd/es/typography/Title";
import "./../SignupForm/AuthForm.scss";
import Link from "antd/es/typography/Link";
import LoginFormProps from "./LoginFormProps";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DownloadOutlined } from "@ant-design/icons";
import { FaGoogle } from "react-icons/fa";

const LoginForm: React.FC<LoginFormProps> = ({ onLoginClick, onSubmit, onGoogleLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [field]: event.target.value });
  };
  const handleSubmit = () => {
    onSubmit(login);
  };
  return (
    <div className='auth-form'>
      <Title className='auth-form--title' level={3}>
        {t("Log in")}
      </Title>

      <Form onFinish={handleSubmit} style={{ marginTop: "1rem" }} layout='vertical' size='large'>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: t("Please enter your email."),
            },
            { type: "email", message: t("Please enter a valid email.") },
          ]}
          hasFeedback
        >
          <Input
            id='loginEmail'
            placeholder='example@company.com'
            onChange={handleChange("email")}
            value={login.email}
            type='text'
          />
        </Form.Item>
        <Form.Item
          label={t("Password")}
          name='password'
          rules={[
            {
              required: true,
              message: t("Enter your password"),
            },
          ]}
          hasFeedback
        >
          <Input.Password
            id='password'
            placeholder={t("Enter your password")}
            onChange={handleChange("password")}
            value={login.password}
            type='password'
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
        </Form.Item>

        <div className='auth-form--forgot-psw'>
          <Link className='auth-form--forgot-psw-link' onClick={() => navigate("/forgot-password")}>
            {t("Forgot your password ?")}
          </Link>
        </div>
        <Button className='auth-form--submit-btn' block htmlType='submit' type='primary' shape='round' size={"large"}>
          {t("Log in")}
        </Button>
        {onGoogleLogin && (
          <Button
            className='auth-form--google-btn'
            block
            type='default'
            shape='round'
            size='large'
            onClick={onGoogleLogin}
            style={{ marginTop: 12 }}
            icon={<FaGoogle />}
          >
            {t("Continue with Google")}
          </Button>
        )}
        <Typography.Text className='auth-form--text'>
          {t("Don't have an account?")}{" "}
          <Typography.Link className='auth-form--textLink' onClick={onLoginClick}>
            {t("Register")}
          </Typography.Link>
        </Typography.Text>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Typography.Link href="https://samlogistic.tn/SamLogisticApp.apk" target="_blank" rel="noopener noreferrer">
            <DownloadOutlined style={{ marginRight: 4 }} />
            {t("Télécharger l'application")}
          </Typography.Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
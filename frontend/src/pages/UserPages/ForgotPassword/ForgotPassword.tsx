import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./../Signup/Auth.scss";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { ResetPasswordReqDto } from "../../../api/myApi";
import { store } from "../../../store/store";
import { resetPasswordReq } from "../../../features/auth/authSlice";
import { useTranslation } from "react-i18next";
const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [resetReqPsw, setResetReqPsw] = useState({ email: "" });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetReqPsw({ ...resetReqPsw, [field]: event.target.value });
  };
  const handleResetPasswordReq = (data: ResetPasswordReqDto) => {
    store.dispatch(resetPasswordReq(data));
  };

  return (
    <div className='auth-page'>
      <img className='auth-page--image' src='./png/loginImage.png' alt='' />
      <div className='auth-page--form'>
        <div className='auth-form'>
          <div style={{ width: "100%", textAlign: "center" }}>
            <img
              className='auth-form--logo'
              style={{ width: 250 }}
              src='./png/vanloglogo-bgwhite.png'
              alt='vanlog Logo'
            />
          </div>
          <Title className='auth-form--title' level={3}>
            {t("Forgot your password ?")}
          </Title>
          <div className='auth-form--title-sub'>
            Veuillez entrer votre adresse e-mail. Vous recevrez un lien vers créez un nouveau mot de passe par e-mail.
          </div>
          <Form onFinish={handleResetPasswordReq} style={{ marginTop: "1rem" }} layout='vertical' size='large'>
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
                id='email'
                placeholder='example@company.com'
                onChange={handleChange("email")}
                value={resetReqPsw.email}
                type='email'
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
              {t("Reset password")}
            </Button>
          </Form>
          <Typography.Text className='auth-form--text'>
            {t("Remember your password?")}{" "}
            <Typography.Link className='auth-form--textLink' onClick={() => navigate("/login")}>
              {t("Log in")}
            </Typography.Link>
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

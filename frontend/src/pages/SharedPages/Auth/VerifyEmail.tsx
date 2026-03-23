import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Input,
  Button,
  Form,
  Typography,
  message,
  Row,
  Col,
  Card,
  Space,
} from "antd";
import {
  MailOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { selectCurrentUser } from "../../../features/user/userSlice";
import { setCurrentUser } from "../../../features/user/userSlice";
import { store } from "../../../store/store";
import axios from "axios";

const api = axios.create();
import "../../UserPages/Signup/Auth.scss";

const { Title, Text, Paragraph } = Typography;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser: any = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);

  const email = location.state?.email || currentUser?.email;
  console.log("Email passé:", email);

  const onFinish = async (values: { code: string }) => {
    if (!email) {
      message.error("Email introuvable, veuillez vous reconnecter.");
      navigate("/signup");
      return;
    }

    try {
      setLoading(true);

      const resp = await api.post("http://localhost:6001/auth/verify-email", {
        email,
        code: values.code,
      });

      const { accessToken, refreshToken, user } = resp.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      store.dispatch(setCurrentUser(user));

      message.success("Email vérifié avec succès.");
      navigate("/user/dashboard");
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Code invalide");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={22} sm={16} md={10}>
          <Card>
            <Title level={3}>Email introuvable</Title>
            <Paragraph>
              Veuillez d&apos;abord effectuer une inscription valide.
            </Paragraph>
            <Button type="primary" onClick={() => navigate("/signup")}>
              Aller à l&apos;inscription
            </Button>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Image à gauche comme avant */}
      <img
        className="auth-page--image"
        src="./png/loginImage.png"
        alt="Verify email"
      />

      {/* Contenu à droite, centré */}
      <div className="auth-page--content">
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card
              style={{
                maxWidth: 480,
                margin: "0 auto",
                boxShadow: "0 18px 45px rgba(15, 23, 42, 0.20)",
                borderRadius: 16,
                border: "none",
              }}
              bodyStyle={{ padding: "32px 32px 28px" }}
            >
              <Space
                direction="vertical"
                size={24}
                style={{ width: "100%" }}
              >
                {/* Icône */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      margin: "0 auto 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <MailOutlined style={{ fontSize: 34, color: "#fff" }} />
                  </div>
                  <Title level={3} style={{ marginBottom: 4 }}>
                    Vérification de votre email
                  </Title>
                  <Text type="secondary">
                    Un code de confirmation a été envoyé à{" "}
                    <Text strong>{email}</Text>.
                  </Text>
                </div>

                {/* Formulaire */}
                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    label="Code de vérification"
                    name="code"
                    rules={[
                      {
                        required: true,
                        message:
                          "Veuillez entrer le code reçu par email.",
                      },
                      {
                        len: 6,
                        message:
                          "Le code doit contenir exactement 6 chiffres.",
                      },
                      {
                        pattern: /^\d+$/,
                        message: "Le code doit contenir uniquement des chiffres.",
                      },
                    ]}
                  >
                    <Input
                      maxLength={6}
                      placeholder="000000"
                      size="large"
                      style={{
                        textAlign: "center",
                        letterSpacing: 8,
                        fontSize: 20,
                        fontWeight: 600,
                      }}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    icon={<CheckCircleOutlined />}
                    style={{
                      marginTop: 4,
                      fontWeight: 600,
                    }}
                  >
                    Valider le code
                  </Button>
                </Form>

                {/* Lien retour */}
                <div style={{ textAlign: "center" }}>
                  <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/login")}
                  >
                    Retour à la connexion
                  </Button>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default VerifyEmail;

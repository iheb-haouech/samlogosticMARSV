import LoginForm from "../../../components/templates/Forms/loginForm/LoginForm";
import { useNavigate } from "react-router-dom";
import "../../UserPages/Signup/Auth.scss";
import { store } from "../../../store/store";
import { login } from "../../../features/auth/authSlice";
import { LoginDto } from "../../../api/myApi";
import PublicMenu from "../../../components/organisms/PublicMenu/PublicMenu";
import { rolesMap } from "../../../types/Roles";
import { usePWAInstall } from "../../../hooks/usePWAInstall";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const { isInstallable, install } = usePWAInstall();

  const handleLogin = async (loginData: LoginDto) => {
    const result = await store.dispatch(login(loginData));

    if (login.fulfilled.match(result)) {
      const user: any = result.payload.user;

      if (user?.roleId === rolesMap.superAdmin) {
        navigate("/superadmin/dashboard", { replace: true });
      } else if (user?.roleId === rolesMap.admin) {
        navigate("/admin/dashboard", { replace: true });
      } else if (user?.roleId === rolesMap.transporter) {
        navigate("/transporter/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    }
  };

  const onLoginClickHandler = () => {
    navigate("/signup");
  };

  return (
    <div className="auth-page">
      <img className="auth-page--image" src="./png/loginImage.png" alt="login Image" />
      <div className="auth-page--content">
        <PublicMenu selectedKey="2" />
        <div className="auth-page--form">
          {isInstallable && (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={install}
              style={{ marginBottom: 16, width: "100%" }}
            >
              Installer l'application
            </Button>
          )}
          <LoginForm onSubmit={handleLogin} onLoginClick={onLoginClickHandler} />
        </div>
      </div>
    </div>
  );
};

export default Login;

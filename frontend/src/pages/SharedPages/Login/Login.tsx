import { useEffect } from "react";
import LoginForm from "../../../components/templates/Forms/loginForm/LoginForm";
import { setCurrentUser } from "../../../features/user/userSlice";
import { setGoogleAuth } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { store } from "../../../store/store";
import { login } from "../../../features/auth/authSlice";
import { LoginDto } from "../../../api/myApi";
import { rolesMap } from "../../../types/Roles";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("google_access_token");
    const refreshToken = params.get("google_refresh_token");
    const userParam = params.get("google_user");

    if (accessToken && refreshToken && userParam) {
      const user = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      store.dispatch(setGoogleAuth({ accessToken, refreshToken, user }));
      store.dispatch(setCurrentUser(user));
      window.history.replaceState({}, document.title, "/login");
    }
  }, []);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      window.alert("Google login is not configured yet.");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "email profile",
      access_type: "offline",
      prompt: "consent",
    }).toString()}`;

    window.location.href = authUrl;
  };

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
      <img className="auth-page--image" src="/png/loginImage.png" alt="login Image" />
      <div className="auth-page--content">
        <div className="auth-page--form">
          <LoginForm onSubmit={handleLogin} onLoginClick={onLoginClickHandler} onGoogleLogin={handleGoogleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;

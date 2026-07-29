import { useEffect } from "react";
import LoginForm from "../../../components/templates/Forms/loginForm/LoginForm";
import { setCurrentUser } from "../../../features/user/userSlice";
import { setGoogleAuth } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { store } from "../../../store/store";
import { login } from "../../../features/auth/authSlice";
import { LoginDto } from "../../../api/myApi";
import { rolesMap } from "../../../types/Roles";
import { useTranslation } from "react-i18next";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // SECURITY: Read Google OAuth tokens from URL fragment (#) instead of query params (?).
    // Fragments are not sent in referrer headers or server logs.
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    let userParam: string | null = null;

    const hash = window.location.hash;
    if (hash && hash.includes("google_auth=")) {
      const fragmentData = hash.substring(1); // Remove #
      const fragmentParams = new URLSearchParams(fragmentData);
      const encodedAuth = fragmentParams.get("google_auth");
      if (encodedAuth) {
        const authParams = new URLSearchParams(decodeURIComponent(encodedAuth));
        accessToken = authParams.get("google_access_token");
        refreshToken = authParams.get("google_refresh_token");
        userParam = authParams.get("google_user");
      }
    }

    // Fallback: also support legacy query params for backward compatibility.
    if (!accessToken) {
      const params = new URLSearchParams(window.location.search);
      accessToken = params.get("google_access_token");
      refreshToken = params.get("google_refresh_token");
      userParam = params.get("google_user");
    }

    if (accessToken && refreshToken && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        store.dispatch(setGoogleAuth({ accessToken, refreshToken, user }));
        store.dispatch(setCurrentUser(user));
        window.history.replaceState({}, document.title, "/login");

        if (user?.roleId === rolesMap.superAdmin) {
          navigate("/superadmin/dashboard", { replace: true });
        } else if (user?.roleId === rolesMap.admin) {
          navigate("/admin/dashboard", { replace: true });
        } else if (user?.roleId === rolesMap.transporter) {
          navigate("/transporter/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      } catch {
        // SECURITY: Silently fail on malformed Google auth data.
        window.history.replaceState({}, document.title, "/login");
      }
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      window.alert(t("googleNotConfigured"));
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
    <div className="auth-premium-layout">
      <div className="auth-ambient-rotation"></div>

      <div className="auth-split-container">
        {/* Left Side Panel */}
        <div className="auth-visual-panel">
          <div className="auth-brand-header" onClick={() => navigate("/")}>
            <div className="icon-shield-rotating">
              <img src="/png/logosam.png" alt="SAM LOGISTIC" />
              <div className="spinning-ring"></div>
            </div>
            <div className="brand-info">
              <span className="title-top">SAM</span>
              <span className="title-sub">LOGISTIC</span>
            </div>
          </div>

          {/* Grouped the image and the marketing text to pull them tight together */}
          <div className="auth-hero-group">
            <div className="auth-image-frame">
              <img className="auth-main-asset" src="/png/loginImage.png" alt="SAM Workspace Terminal" />
            </div>

            <div className="auth-marketing-deck">
              <h3>{t("enterpriseCommandCenter")}</h3>
              <p>{t("enterpriseCommandCenterDesc")}</p>
            </div>
          </div>
          
          {/* Empty spacer for flex-space-between alignment symmetry */}
          <div className="auth-panel-footer-space"></div>
        </div>

        {/* Right Side Panel */}
        <div className="auth-content-panel">
          <div className="mobile-brand-wrapper" onClick={() => navigate("/")}>
            <img src="/png/logosam.png" alt="SAM LOGISTIC" />
            <span>SAM LOGISTIC</span>
          </div>

          <div className="auth-form-card-wrapper">
            <div className="form-context-header">
              <h2>{t("welcomeBack")}</h2>
              <p>{t("welcomeBackDesc")}</p>
            </div>
            
            <div className="form-component-wrapper">
              {/* Upgraded the logo presentation with a bold premium dark dynamic frame */}
              <div className="form-centered-logo-container">
                <div className="clear-logo-badge">
                  <img src="/png/logosam.png" alt="SAM Logo" />
                </div>
              </div>

              <LoginForm 
                onSubmit={handleLogin} 
                onLoginClick={onLoginClickHandler} 
                onGoogleLogin={handleGoogleLogin} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
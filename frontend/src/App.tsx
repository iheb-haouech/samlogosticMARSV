import { BrowserRouter as Router } from "react-router-dom";
import "./i18n.config";
import { useEffect, useState } from "react";
import {
  fetchCurrentUser,
  selectCurrentUser,
  setCurrentUser,
} from "./features/user/userSlice";
import { store } from "./store/store";
import { ConfigProvider } from "antd";
import { antdThemeConfig } from "./styles/antdTheme/antdThemeConfig";
import { Loading } from "./components/atoms/Loading/Loading";
import { useSelector } from "react-redux";
import { usePublicRoutes } from "./routes/usePublicRoutes";
import useAdminRoutes from "./routes/useAdminRoutes";
import useUserRoutes from "./routes/useUserRoutes";
import { useTranslation } from "react-i18next";
import useTransporterRoutes from "./routes/useTransporterRoutes";
import useSuperAdminRoutes from "./routes/useSuperAdminRoutes";
import { rolesMap } from "./types/Roles";
import "./styles/tables-professional.scss";
import "./styles/dark-theme.scss";
import { ThemeProvider } from "./context/ThemeContext";
import CookieBanner from "./CookieBanner";
import SplashScreen from "./components/atoms/SplashScreen/SplashScreen";
import { initPushNotifications } from "./services/pushNotifications";

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const currentUser: any = useSelector(selectCurrentUser);
  const { i18n } = useTranslation();

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem("accessToken");
      const hasSeenSplash = localStorage.getItem("hasSeenSplash");

      if (!hasSeenSplash) {
        setShowSplash(true);
      }

      if (token) {
        try {
          await store.dispatch(fetchCurrentUser(token)).unwrap();
          initPushNotifications();
        } catch {
          store.dispatch(setCurrentUser(null));
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }

      setIsAppReady(true);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const isAuthenticated = !!currentUser;

  if (showSplash) {
    return <SplashScreen isAuthenticated={isAuthenticated} />;
  }

  if (!isAppReady) {
    return <Loading />;
  }

  const publicRoutes = usePublicRoutes();
  const adminRoutes = useAdminRoutes();
  const userRoutes = useUserRoutes();
  const transporterRoutes = useTransporterRoutes();
  const superAdminRoutes = useSuperAdminRoutes();

  return (
    <ThemeProvider>
      <ConfigProvider theme={antdThemeConfig}>
        <CookieBanner />
        <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          {!isAuthenticated
            ? publicRoutes
            : currentUser?.roleId === rolesMap.superAdmin
              ? superAdminRoutes
              : currentUser?.roleId === rolesMap.admin
                ? adminRoutes
                : currentUser?.roleId === rolesMap.transporter
                  ? transporterRoutes
                  : currentUser?.roleId === rolesMap.user
                    ? userRoutes
                    : publicRoutes}
        </Router>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
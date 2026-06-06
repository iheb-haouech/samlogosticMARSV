import { BrowserRouter as Router } from "react-router-dom";
import "./i18n.config";
import { useEffect, useState } from "react";
import { fetchCurrentUser, selectCurrentUser, setCurrentUser } from "./features/user/userSlice";
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
import "./styles/tables-professional.scss";
import "./styles/dark-theme.scss";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const currentUser: any = useSelector(selectCurrentUser);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        store.dispatch(setCurrentUser(null));
        setIsLoading(false);
        return;
      }

      try {
        await store.dispatch(fetchCurrentUser(token)).unwrap();
      } catch {
        store.dispatch(setCurrentUser(null));
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const rolesMap = {
    admin: 1,
    transporter: 2,
    user: 3,
  };

  const isAuthenticated = !!currentUser;
  const publicRoutes = usePublicRoutes();
  const adminRoutes = useAdminRoutes();
  const userRoutes = useUserRoutes();
  const transporterRoutes = useTransporterRoutes();

  return (
    <ThemeProvider>
      <ConfigProvider theme={antdThemeConfig}>
        {isLoading ? (
          <Loading />
        ) : (
          <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            {!isAuthenticated
              ? publicRoutes
              : currentUser?.roleId === rolesMap.admin
                ? adminRoutes
                : currentUser?.roleId === rolesMap.transporter
                  ? transporterRoutes
                  : currentUser?.roleId === rolesMap.user
                    ? userRoutes
                    : publicRoutes}
          </Router>
        )}
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;

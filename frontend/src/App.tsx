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
import './styles/tables-professional.scss';
import './styles/dark-theme.scss'; // 🆕
import { ThemeProvider } from './context/ThemeContext'; // 🆕



function App() {
  const [isLoading, setIsLoading] = useState<any>(true);
  const currentUser: any = useSelector(selectCurrentUser);
  console.log("currentUser FRONT", currentUser);
  console.log("roleId FRONT", currentUser?.roleId);


  const token: any = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        store.dispatch(fetchCurrentUser(token));
        setIsLoading(false);
      } catch (error) {
        // If an error occurs, reset the current user state and remove tokens
        store.dispatch(setCurrentUser(null));
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang) {
      i18n.changeLanguage(storedLang);
    }
  }, []);

  const rolesMap = {
    admin: 1,         // admin@test.com
    transporter: 2,   // transporter@test.com
    user: 3,          // user@test.com
  };

  const publicRoutes = usePublicRoutes();
  const adminRoutes = useAdminRoutes();
  const userRoutes = useUserRoutes();
  const transporterRoutes = useTransporterRoutes();

  return (
<ThemeProvider> {/* 🆕 Wrapper */}
    <ConfigProvider theme={antdThemeConfig}>
      {isLoading ? (
        <Loading />
      ) : (
        <Router>
          {!token ? (
            publicRoutes
          ) : (
            currentUser?.roleId === rolesMap.admin ? (
              adminRoutes
            ) : currentUser?.roleId === rolesMap.transporter ? (
              transporterRoutes
            ) : currentUser?.roleId === rolesMap.user ? (
              userRoutes
            ) : (
              publicRoutes
            )
          )}
        </Router>
      )}
    </ConfigProvider>
  </ThemeProvider>);
}

export default App;

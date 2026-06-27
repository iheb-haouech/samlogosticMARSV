import { Layout, Drawer } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../../components/organisms/NavBar/NavBar";
import SideMenu from "../../../components/organisms/SideMenu/SideMenu";
import colors from "../../../styles/colors/colors";
import { useSelector } from "react-redux";
import { selectCurrentUser, setCurrentUser } from "../../../features/user/userSlice";
import { MdOutlineSpaceDashboard, MdOutlineAddCircle } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineCustomerService } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import {
  CarOutlined,
  ShopOutlined,
  FileTextOutlined,
  AimOutlined,
  WalletOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { selectedStatistic } from "../../../features/statistics/statisticsSlice";
import { store } from "../../../store/store";
import { rolesMap } from "../../../types/Roles";
import { useState, useEffect } from "react";

const { Content } = Layout;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const storedLang = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useState(window.innerWidth <= 900);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageName, setPageName] = useState<string>("");
  const [pageIcon, setPageIcon] = useState<any>(<></>);
  const location = useLocation();
  const currentUser: any = useSelector(selectCurrentUser);
  const statistics: any = useSelector(selectedStatistic);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      const shouldCollapse = window.innerWidth <= 900;
      setCollapsed(shouldCollapse);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!currentUser) return null;
  const isSuperAdmin: boolean = currentUser?.roleId === rolesMap.superAdmin;
  const isAdmin: boolean = currentUser?.roleId === rolesMap.admin;
  const isTransporter: boolean = currentUser?.roleId === rolesMap.transporter;
  const isB2C = currentUser?.accountType === "B2C";

  const userMenuItems = [
    { key: "/user/dashboard", label: t("dashboard"), icon: <MdOutlineSpaceDashboard /> },
    { key: "/user/orders", label: t("ordersList"), icon: <FiShoppingCart /> },
    ...(isB2C
      ? [{ key: "/user/create-order", label: "Créer une commande", icon: <MdOutlineAddCircle /> }]
      : []),
    {
      key: "/user/complaints",
      label: t("complaints"),
      icon: <AiOutlineCustomerService />,
      badgeCount: statistics?.totalComplaints,
    },
    { key: "/user/track-orders", label: t("TrackingOrders"), icon: <AimOutlined /> },
  ];

  const transporterMenuItems = [
    { key: "/transporter/dashboard", label: t("dashboard"), icon: <MdOutlineSpaceDashboard /> },
    { key: "/transporter/orders", label: t("ordersList"), icon: <FiShoppingCart /> },
    { key: "/transporter/invoices", label: t("paymentInvoices"), icon: <FileTextOutlined /> },
    {
      key: "/transporter/complaints",
      label: t("complaints"),
      icon: <AiOutlineCustomerService />,
      badgeCount: statistics?.totalComplaints,
    },
  ];
  const transporterAllMenuItems = [
    ...transporterMenuItems,
    { key: "/transporter/profile", label: t("profile"), icon: <FaRegUser /> },
  ];
  const userAllMenuItems = [...userMenuItems, { key: "/user/profile", label: t("profile"), icon: <FaRegUser /> }];

  const adminMenuItems = [
    { key: "/admin/dashboard", label: t("dashboard"), icon: <MdOutlineSpaceDashboard /> },
    {
      key: "/admin/orders",
      label: t("ordersList"),
      icon: <FiShoppingCart />,
      badgeCount: statistics?.totalWaitingOrders,
    },
    {
      key: "/admin/transporters",
      label: t("transportersList"),
      icon: <CarOutlined />,
      badgeCount: statistics?.totalWaitingTransporters,
    },
    {
      key: "/admin/providers",
      label: t("providersList"),
      icon: <ShopOutlined />,
      badgeCount: statistics?.totalWaitingProviders,
    },
    { key: "/admin/invoices", label: t("paymentInvoices"), icon: <FileTextOutlined /> },
    { key: "/admin/cashflow", label: t("cashflow"), icon: <WalletOutlined /> },
    {
      key: "/admin/complaints",
      label: t("complaints"),
      icon: <AiOutlineCustomerService />,
      badgeCount: statistics?.totalComplaints,
    },
    { key: "/admin/track-orders", label: t("TrackingOrders"), icon: <AimOutlined /> },
  ];

  const adminAllMenuItems = [...adminMenuItems, { key: "/admin/profile", label: t("profile"), icon: <FaRegUser /> }];
  const superAdminMenuItems = [
    { key: "/superadmin/dashboard", label: t("dashboard"), icon: <MdOutlineSpaceDashboard /> },
    { key: "/superadmin/users", label: "Users & roles", icon: <UserSwitchOutlined /> },
    {
      key: "/superadmin/orders",
      label: t("ordersList"),
      icon: <FiShoppingCart />,
      badgeCount: statistics?.totalWaitingOrders,
    },
    {
      key: "/superadmin/transporters",
      label: t("transportersList"),
      icon: <CarOutlined />,
      badgeCount: statistics?.totalWaitingTransporters,
    },
    {
      key: "/superadmin/providers",
      label: t("providersList"),
      icon: <ShopOutlined />,
      badgeCount: statistics?.totalWaitingProviders,
    },
    { key: "/superadmin/invoices", label: t("paymentInvoices"), icon: <FileTextOutlined /> },
    { key: "/superadmin/cashflow", label: t("cashflow"), icon: <WalletOutlined /> },
    {
      key: "/superadmin/complaints",
      label: t("complaints"),
      icon: <AiOutlineCustomerService />,
      badgeCount: statistics?.totalComplaints,
    },
    { key: "/superadmin/track-orders", label: t("TrackingOrders"), icon: <AimOutlined /> },
  ];
  const superAdminAllMenuItems = [
    ...superAdminMenuItems,
    { key: "/superadmin/profile", label: t("profile"), icon: <FaRegUser /> },
  ];

  useEffect(() => {
    const getPageDetails = () => {
      const path = location.pathname;
      const allMenuItems = isSuperAdmin
        ? superAdminAllMenuItems
        : isAdmin
          ? adminAllMenuItems
          : isTransporter
            ? transporterAllMenuItems
            : userAllMenuItems;
      const currentPage = allMenuItems.find((item) => item.key === path);
      if (currentPage) {
        setPageName(storedLang == "en" ? `${currentPage.label} - ${t("page")}` : `${t("page")} - ${currentPage.label}`);
        setPageIcon(currentPage.icon);
      } else {
        setPageName("");
        setPageIcon(<></>);
      }
    };
    getPageDetails();
  }, [location.pathname, isAdmin, isSuperAdmin, isTransporter, t]);

  const handelLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    store.dispatch(setCurrentUser(null));
    navigate("/login", { replace: true });
  };
  const userDisplayName =
    currentUser?.companyName ||
    `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
    currentUser?.email ||
    "";

  const menuItems = isSuperAdmin ? superAdminMenuItems : isAdmin ? adminMenuItems : isTransporter ? transporterMenuItems : userMenuItems;

  return (
    <Layout style={{ height: "100vh" }}>
      {isMobile ? (
        <Drawer
          title={null}
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={260}
          styles={{ body: { padding: 0 } }}
          closable={false}
          maskClosable={true}
        >
          <SideMenu
            menuItems={menuItems}
            logOut={handelLogOut}
            collapsed={false}
            onCollapse={() => setCollapsed(!collapsed)}
            width={260}
          />
        </Drawer>
      ) : (
        <SideMenu
          menuItems={menuItems}
          logOut={handelLogOut}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          width={245}
        />
      )}

      <Layout
        style={{
          marginLeft: isMobile ? 0 : (!collapsed ? "245px" : "60px"),
          transition: "margin-left 0.2s",
        }}
      >
        <NavBar
          userName={userDisplayName}
          pageName={pageName}
          userImg=""
          pageIcon={pageIcon}
          profileRoute={
            isSuperAdmin
              ? "/superadmin/profile"
              : isAdmin
                ? "/admin/profile"
                : isTransporter
                  ? "/transporter/profile"
                  : "/user/profile"
          }
          walletBalance={currentUser?.walletBalance}
          onMenuToggle={isMobile ? () => setMobileMenuOpen(!mobileMenuOpen) : undefined}
          isMobile={isMobile}
        />
        <Content
          style={{
            margin: isMobile ? "8px" : "12px",
          }}
        >
          <div
            style={{
              padding: isMobile ? 12 : 22,
              background: colors.white,
              borderRadius: "4px",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
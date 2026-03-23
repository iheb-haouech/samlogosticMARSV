import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../../../components/organisms/NavBar/NavBar";
import SideMenu from "../../../components/organisms/SideMenu/SideMenu";
import colors from "../../../styles/colors/colors";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/user/userSlice";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineCustomerService } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { CarOutlined, ShopOutlined, FileTextOutlined, AimOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next"; // Importing the translation hook
import { selectedStatistic } from "../../../features/statistics/statisticsSlice";

const { Content } = Layout;

const DashboardLayout: React.FC = () => {
  const storedLang = localStorage.getItem("i18nextLng");
  const { t } = useTranslation(); // Initializing the translation hook

  const [collapsed, setCollapsed] = useState(window.innerWidth <= 900 ? true : false);
  const [pageName, setPageName] = useState<string>("");
  const [pageIcon, setPageIcon] = useState<any>(<></>);
  const location = useLocation();
  const currentUser: any = useSelector(selectCurrentUser);
  const statistics: any = useSelector(selectedStatistic);

  const isAdmin: boolean = currentUser?.roleId === 1;
  const isTransporter: boolean = currentUser?.roleId === 2;
  // Dynamically create menu items with translation
  const userMenuItems = [
    { key: "/user/dashboard", label: t("dashboard"), icon: <MdOutlineSpaceDashboard /> },
    { key: "/user/orders", label: t("ordersList"), icon: <FiShoppingCart /> },
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
    {
      key: "/admin/complaints",
      label: t("complaints"),
      icon: <AiOutlineCustomerService />,
      badgeCount: statistics?.totalComplaints,
    },
    { key: "/admin/track-orders", label: t("TrackingOrders"), icon: <AimOutlined /> },
  ];

  const adminAllMenuItems = [...adminMenuItems, { key: "/admin/profile", label: t("profile"), icon: <FaRegUser /> }];

  useEffect(() => {
    const getPageDetails = () => {
      const path = location.pathname;
      const allMenuItems = isAdmin ? adminAllMenuItems : isTransporter ? transporterAllMenuItems : userAllMenuItems;
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
  }, [location.pathname, isAdmin, t]); // Added 't' to the dependency array to re-translate when language changes

  const handelLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "login";
    window.location.reload();
  };
   const userDisplayName =
             currentUser?.companyName ||
             `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
               currentUser?.email ||
             "";

  return (
    <Layout style={{ height: "100vh" }}>
      <SideMenu
        menuItems={isAdmin ? adminMenuItems : isTransporter ? transporterMenuItems : userMenuItems}
        logOut={handelLogOut}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        width={245}
      ></SideMenu>

      <Layout style={{ marginLeft: !collapsed ? "245px" : "60px" }}>
        <NavBar
       
          userName={userDisplayName}
          pageName={pageName}
          userImg=''
          pageIcon={pageIcon}
          profileRoute={isAdmin ? "/admin/profile" : isTransporter ? "/transporter/profile" : "/user/profile"}
        />
        <Content style={{ margin: "12px" }}>
          <div
            style={{
              padding: 22,
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

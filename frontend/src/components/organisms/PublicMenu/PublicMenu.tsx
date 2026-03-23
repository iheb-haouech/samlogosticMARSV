import React from "react";
import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import "./PublicMenu.scss";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../molecules/LanguageSwitcher/LanguageSwitcher";

type PublicMenuProps = {
  selectedKey: string;
};

const PublicMenu: React.FC<PublicMenuProps> = ({ selectedKey }) => {
  const { t } = useTranslation(); // Correctly destructure 't' here
  const { Header } = Layout;

  const publicMenuItems = [
    { key: "1", label: t("TrackingOrders"), path: "/tracking-orders" },
    { key: "2", label: t("Login"), path: "/login" },
    { key: "3", label: t("Signup"), path: "/signup" },
  ];

  return (
    <Header className='auth-page--header'>
      <Menu className='auth-page--menu' mode='horizontal' selectedKeys={[selectedKey]}>
        {publicMenuItems.map((item) => (
          <Menu.Item key={item.key}>
            <Link className='auth-page--menu-item' to={item.path}>
              {item.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <LanguageSwitcher />
    </Header>
  );
};

export default PublicMenu;

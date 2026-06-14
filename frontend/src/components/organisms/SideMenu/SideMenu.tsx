import { Badge, Button, Layout, Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { TbLogout } from "react-icons/tb";
import "./SideMenu.scss";
import { useTranslation } from "react-i18next";
import { BRAND_LOGO, BRAND_LOGO_ICON, BRAND_NAME } from "../../../constants/branding";

type MenuItem = {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
};

interface SideMenuProps {
  menuItems: MenuItem[];
  logOut: () => void;
  collapsed: boolean;
  onCollapse: () => void;
  width: number;
}

const SideMenu: React.FC<SideMenuProps> = ({ menuItems, logOut, collapsed, onCollapse, width }: SideMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const transformMenuItems = (items: MenuItem[]): MenuProps["items"] => {
    return items.map((item) => {
      const { badgeCount, ...rest } = item as any;
      return {
        ...rest,
        label: badgeCount ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {item.label}
            <Badge
              count={badgeCount > 99 ? "+99" : badgeCount}
              style={{
                color: "white",
                fontSize: 10,
                borderColor: "transparent",
                marginLeft: 4,
              }}
            />
          </span>
        ) : (
          item.label
        ),
      };
    });
  };

  const cleanedMenuItems = useMemo(() => transformMenuItems(menuItems), [menuItems]);

  return (
    <Layout.Sider
      className='side-menu--container ant-layout-sider'
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapsedWidth='60'
      width={width}
    >
      <div className='side-menu-flex'>
        <div className='side-menu'>
          <div className='side-menu--header'>
            <img
              className={`side-menu--header-logo${collapsed ? "-expanded" : ""}`}
              src={collapsed ? BRAND_LOGO_ICON : BRAND_LOGO}
              alt={`${BRAND_NAME} logo`}
              style={{
                width: collapsed ? "42px" : "170px",
                height: collapsed ? "42px" : "80px",
                objectFit: "contain",
                transition: "width 0.3s ease, height 0.3s ease",
              }}
            />
          </div>

          <Menu
            selectedKeys={[selectedKey]}
            theme='dark'
            mode='inline'
            onClick={(item) => {
              navigate(item.key.toString());
              setSelectedKey(item.key.toString());
            }}
            items={cleanedMenuItems}
            className='side-menu--menu'
          />
        </div>
        <div>
          <Button onClick={logOut} className='side-menu--logout' ghost size={"large"}>
            <TbLogout /> <span style={{ fontSize: "1rem" }}>{collapsed ? "" : t("Logout")}</span>
          </Button>
        </div>
      </div>
    </Layout.Sider>
  );
};

export default SideMenu;

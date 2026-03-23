import { Badge, Button, Layout, Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbLogout } from "react-icons/tb";
import "./SideMenu.scss";
import { useTranslation } from "react-i18next";
import MenuItem from "antd/es/menu/MenuItem";

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

  const renderMenuItem = (item: any) => {
    return (
      <>
        <Badge
          count={item?.badgeCount > 99 ? "+99" : item?.badgeCount}
          style={{
            color: "white",
            fontSize: 10,
            borderColor: "transparent",
          }}
        />
      </>
    );
  };

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
              src={collapsed ? "../png/logo-icon.png" : "../png/vanlogLogo.png"}
              alt='vanlog logo'
              style={{
                maxWidth: collapsed ? "3rem" : "90%",
                transition: "max-width 0.3s ease",
              }}
            />
          </div>

          <Menu
            selectedKeys={[selectedKey]}
            theme='dark'
            mode='inline'
            itemIcon={(item: any) => renderMenuItem(item)}
            onClick={(item) => {
              navigate(item.key.toString());
              setSelectedKey(item.key.toString());
            }}
            items={menuItems as MenuProps["items"]}
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

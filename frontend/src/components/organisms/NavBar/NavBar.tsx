import { Header } from "antd/es/layout/layout";
import "./NavBar.scss";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import { FaUser } from "react-icons/fa";
import { WalletOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import LanguageSwitcher from "../../molecules/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle";

interface NavBarProps {
  userImg?: string;
  userName: string;
  pageName: string;
  pageIcon?: React.ReactNode;
  profileRoute: string;
  walletBalance?: number;
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({
  userImg,
  userName,
  pageName,
  pageIcon,
  profileRoute,
  walletBalance,
  onMenuToggle,
  isMobile = false,
}: NavBarProps) => {

  return (
    <Header className='header-container'>
      <div>
        <div className='header--page-label'>
          {isMobile && onMenuToggle && (
            <MenuUnfoldOutlined
              onClick={onMenuToggle}
              style={{
                fontSize: 20,
                cursor: 'pointer',
                marginRight: 8,
                color: 'var(--gray-700)',
              }}
            />
          )}
          <span className='header--page-label-icon'>{pageIcon}</span>
          <h4 className='header--page-label--title'>{pageName}</h4>
        </div>
      </div>

      <div className='header--right-section'>
        <ThemeToggle />

        {typeof walletBalance === "number" && (
          <div className='header--wallet'>
            <WalletOutlined />
            <span>{walletBalance.toFixed(3)} DT</span>
          </div>
        )}

        <Link to={profileRoute}>
          <div className='header--user'>
            <h3 className='header--user-name'>{userName ? userName : "Mon profil"}</h3>
            {userImg ? (
              <Avatar src={userImg} size={isMobile ? 30 : 34} style={{ backgroundColor: "#fde3cf", color: "#f56a00" }} />
            ) : (
              <Avatar icon={<FaUser />} size={isMobile ? 30 : 34} style={{ backgroundColor: "#fde3cf", color: "#f56a00" }} />
            )}
          </div>
        </Link>

        <LanguageSwitcher />
      </div>
    </Header>
  );
};

export default NavBar;

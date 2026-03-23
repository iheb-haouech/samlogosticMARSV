import { Header } from "antd/es/layout/layout";
import "./NavBar.scss";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import { FaUser } from "react-icons/fa";
import LanguageSwitcher from "../../molecules/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle"; // 🆕

interface NavBarProps {
  userImg?: string;
  userName: string;
  pageName: string;
  pageIcon?: React.ReactNode;
  profileRoute: string;
}

const NavBar: React.FC<NavBarProps> = ({ userImg, userName, pageName, pageIcon, profileRoute }: NavBarProps) => {
  return (
    <Header className='header-container'>
      <div>
        <div className='header--page-label'>
          <span className='header--page-label-icon'>{pageIcon}</span>
          <h4 className='header--page-label--title'>{pageName}</h4>
        </div>
      </div>
      
      <div className='header--right-section'>
        {/* 🆕 DARK MODE TOGGLE */}
        <ThemeToggle />
        
        <Link to={profileRoute}>
          <div className='header--user'>
            <h3 className='header--user-name'>{userName ? userName : "Mon profil"}</h3>
            {userImg ? (
              <Avatar src={userImg} size={34} style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}></Avatar>
            ) : (
              <Avatar icon={<FaUser />} size={34} style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}></Avatar>
            )}
          </div>
        </Link>
        
        <LanguageSwitcher />
      </div>
    </Header>
  );
};

export default NavBar;

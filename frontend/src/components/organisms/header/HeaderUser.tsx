import { Button, theme, Space, Avatar, Dropdown } from "antd";
import { Header } from "antd/es/layout/layout";
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle"; // 🆕
import type { MenuProps } from 'antd';
import './headerUser.scss';

interface HeaderIOProps {
  collapsed: boolean;
  setCollapsed: any;
}

export default function HeaderUser({ collapsed, setCollapsed }: HeaderIOProps) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Menu utilisateur (dropdown)
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mon profil',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      danger: true,
    },
  ];

  return (
    <Header 
      style={{ 
        padding: '0 24px', 
        background: colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        transition: 'background 0.3s ease',
      }}
      className="header-user"
    >
      {/* LEFT SIDE */}
      <Space size="middle" style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 48,
            height: 48,
          }}
        />
        
        {/* ✅ LOGO + NOM SAMLOGISTICS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/png/logo-samlogistics.png" 
            alt="Samlogistics" 
            style={{ height: '40px' }}
          />
          <div>
            <div style={{ 
              fontFamily: 'Poppins',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--primary-color, #0d2c58)',
              lineHeight: '1',
              transition: 'color 0.3s ease',
            }}>
              SAMLOGISTICS
            </div>
            <div style={{ 
              fontSize: '9px',
              letterSpacing: '1.5px',
              color: 'var(--secondary-color, #5890cc)',
              marginTop: '2px',
              transition: 'color 0.3s ease',
            }}>
              SHIP.TRACK.DELIVER
            </div>
          </div>
        </div>
      </Space>

      {/* RIGHT SIDE */}
      <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
        {/* 🆕 DARK MODE TOGGLE */}
        <ThemeToggle />

        {/* 🆕 USER MENU */}
        <Dropdown 
          menu={{ items: userMenuItems }} 
          placement="bottomRight"
          trigger={['click']}
        >
          <Avatar 
            size="large" 
            icon={<UserOutlined />} 
            style={{ 
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #0d2c58, #5890cc)',
              transition: 'transform 0.3s ease',
            }}
            className="user-avatar-header"
          />
        </Dropdown>
      </Space>
    </Header>
  );
}

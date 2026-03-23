import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../../../hooks/useTheme';
import './ThemeToggle.scss';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        checkedChildren={<BulbFilled style={{ color: '#ffd700' }} />}
        unCheckedChildren={<BulbOutlined />}
        size="default"
      />
    </div>
  );
};

export default ThemeToggle;

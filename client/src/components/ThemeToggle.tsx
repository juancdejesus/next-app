'use client';

import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={theme === 'dark' ? <BulbFilled /> : <BulbOutlined />}
      onClick={toggleTheme}
      style={{ fontSize: 20 }}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    />
  );
}

'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Avatar, Dropdown, Badge, Breadcrumb, theme } from 'antd';
import {
  DashboardOutlined,
  CloudUploadOutlined,
  FolderOpenOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import ThemeToggle from './ThemeToggle';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

// Map routes to menu keys
const routeToKeyMap: Record<string, string> = {
  '/': '1',
  '/upload': '2',
  '/jobs': '3',
  '/approvals': '4',
  '/templates': '5',
  '/items': '6',
  '/settings': '7',
  '/help': 'help',
};

// Map menu keys to routes
const keyToRouteMap: Record<string, string> = {
  '1': '/',
  '2': '/upload',
  '3': '/jobs',
  '4': '/approvals',
  '5': '/templates',
  '6': '/items',
  '7': '/settings',
  'help': '/help',
};

// Get page title from pathname
const getPageTitle = (path: string): string => {
  const titleMap: Record<string, string> = {
    '/': 'Dashboard',
    '/upload': 'Upload',
    '/jobs': 'Jobs',
    '/approvals': 'Approvals',
    '/templates': 'Templates',
    '/items': 'Items',
    '/settings': 'Settings',
    '/help': 'Help',
  };
  return titleMap[path] || 'Dashboard';
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Get the selected key directly from pathname - no state needed
  const selectedKey = routeToKeyMap[pathname] || '1';

  // Handle menu click
  const handleMenuClick = (key: string) => {
    const route = keyToRouteMap[key];
    if (route) {
      router.push(route);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => handleMenuClick('1'),
    },
    {
      key: '2',
      icon: <CloudUploadOutlined />,
      label: 'Upload',
      onClick: () => handleMenuClick('2'),
    },
    {
      key: '3',
      icon: <FolderOpenOutlined />,
      label: 'Jobs',
      onClick: () => handleMenuClick('3'),
    },
    {
      key: '4',
      icon: <CheckSquareOutlined />,
      label: 'Approvals',
      onClick: () => handleMenuClick('4'),
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      label: 'Templates',
      onClick: () => handleMenuClick('5'),
    },
    {
      key: '6',
      icon: <AppstoreOutlined />,
      label: 'Items',
      onClick: () => handleMenuClick('6'),
    },
    {
      key: '7',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => handleMenuClick('7'),
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'settings',
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={256}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: '#1677ff',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DatabaseOutlined style={{ color: 'white', fontSize: 18 }} />
          </div>
          {!collapsed && (
            <h1 style={{ color: 'white', margin: 0, fontSize: 16, fontWeight: 600 }}>
              Data Update Portal
            </h1>
          )}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
        />
        <div style={{ position: 'absolute', bottom: 50, width: '100%', padding: '0 16px' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKey === 'help' ? ['help'] : []}
            items={[
              {
                key: 'help',
                icon: <QuestionCircleOutlined />,
                label: 'Help',
                onClick: () => handleMenuClick('help'),
              },
            ]}
          />
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Breadcrumb
            items={[
              {
                title: 'Home',
              },
              {
                title: getPageTitle(pathname),
              },
            ]}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ThemeToggle />
            <Badge count={5}>
              <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            </Badge>
            <QuestionCircleOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>John Smith</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>Global Submitter</div>
                </div>
                <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyvO8dEbiL0_-6snr-tnpdQwsVDCKfE3lcZyKUY7gqAl9BhWk5iLFI9pXlqDlgWkhmC1OZoemI30jKyxfQw2xCgj768N1mQRxZUIkAqG6imhRVHvxuxu93TMTlb3TUzrZRacK-vmGdhv55KkHbJDvfemwPnuUalnesul0bo1J5dQMe0Mkq2SGQ9axisPUAvv__yyq44XrOXcpNtlI02ESjWzpmSpnutgTIAOeLaNuWIXOVozCXNfmNdcCztB3NmpQsXeoB2FYiKcru" />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

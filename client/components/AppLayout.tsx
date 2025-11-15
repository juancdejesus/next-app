'use client';
import '@ant-design/v5-patch-for-react-19';


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
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import '../i18n/config';

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
  '/users': '7',
  '/settings': '8',
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
  '7': '/users',
  '8': '/settings',
  'help': '/help',
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Map pathname to translation key
  const getPageTitleKey = (path: string): string => {
    const keyMap: Record<string, string> = {
      '/': 'menu.dashboard',
      '/upload': 'menu.upload',
      '/jobs': 'menu.jobs',
      '/approvals': 'menu.approvals',
      '/templates': 'menu.templates',
      '/items': 'menu.items',
      '/users': 'menu.users',
      '/settings': 'menu.settings',
      '/help': 'menu.help',
    };
    return keyMap[path] || 'menu.dashboard';
  };

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
      label: t('menu.dashboard'),
      onClick: () => handleMenuClick('1'),
    },
    {
      key: '2',
      icon: <CloudUploadOutlined />,
      label: t('menu.upload'),
      onClick: () => handleMenuClick('2'),
    },
    {
      key: '3',
      icon: <FolderOpenOutlined />,
      label: t('menu.jobs'),
      onClick: () => handleMenuClick('3'),
    },
    {
      key: '4',
      icon: <CheckSquareOutlined />,
      label: t('menu.approvals'),
      onClick: () => handleMenuClick('4'),
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      label: t('menu.templates'),
      onClick: () => handleMenuClick('5'),
    },
    {
      key: '6',
      icon: <AppstoreOutlined />,
      label: t('menu.items'),
      onClick: () => handleMenuClick('6'),
    },
    {
      key: '7',
      icon: <UserOutlined />,
      label: t('menu.users'),
      onClick: () => handleMenuClick('7'),
    },
    {
      key: '8',
      icon: <SettingOutlined />,
      label: t('menu.settings'),
      onClick: () => handleMenuClick('8'),
    },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: t('userMenu.profile'),
    },
    {
      key: 'settings',
      label: t('userMenu.settings'),
    },
    {
      key: 'language',
      label: t('userMenu.language'),
      icon: <GlobalOutlined />,
      children: [
        {
          key: 'en',
          label: t('language.english'),
          onClick: () => changeLanguage('en'),
        },
        {
          key: 'es',
          label: t('language.spanish'),
          onClick: () => changeLanguage('es'),
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: t('userMenu.logout'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={200}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          userSelect: 'none',
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
              flexShrink: 0,
            }}
          >
            <DatabaseOutlined style={{ color: 'white', fontSize: 18 }} />
          </div>
          <h1
            style={{
              color: 'white',
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              opacity: collapsed ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
              transitionDelay: collapsed ? '0s' : '0.2s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: collapsed ? 0 : 'auto',
            }}
          >
            {t('app.name')}
          </h1>
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
                label: t('menu.help'),
                onClick: () => handleMenuClick('help'),
              },
            ]}
            style={{ userSelect: 'none' }}
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
                title: t('breadcrumb.home'),
              },
              {
                title: t(getPageTitleKey(pathname)),
              },
            ]}
            style={{cursor: 'pointer', userSelect: 'none' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, userSelect: 'none', }}>
            <ThemeToggle />
            <Badge count={5}>
              <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            </Badge>
            <QuestionCircleOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t('user.name')}</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>{t('user.role')}</div>
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

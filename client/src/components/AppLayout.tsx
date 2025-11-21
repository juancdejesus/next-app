'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Avatar, Dropdown, Badge, Breadcrumb, theme } from 'antd';
import { LayoutPanelLeft } from 'lucide-react';
import {
  DashboardOutlined,
  CloudUploadOutlined,
  FolderOpenOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import '../i18n/config';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

// Menu route configuration
const menuRoutes = [
  { key: '/', icon: <DashboardOutlined />, labelKey: 'menu.dashboard' },
  { key: '/upload', icon: <CloudUploadOutlined />, labelKey: 'menu.upload' },
  { key: '/jobs', icon: <FolderOpenOutlined />, labelKey: 'menu.jobs' },
  { key: '/approvals', icon: <CheckSquareOutlined />, labelKey: 'menu.approvals' },
  { key: '/templates', icon: <FileTextOutlined />, labelKey: 'menu.templates' },
  { key: '/items', icon: <AppstoreOutlined />, labelKey: 'menu.items' },
  { key: '/users', icon: <UserOutlined />, labelKey: 'menu.users' },
  { key: '/settings', icon: <SettingOutlined />, labelKey: 'menu.settings' },
] as const;

export default function AppLayout({ children }: AppLayoutProps) {
  // Initialize collapsed state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('siderCollapsed');
      return savedCollapsed === 'true';
    }
    return false;
  });
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { siderColor } = useTheme();
  const { currentUser, loading: userLoading } = useUser();
  const {
    token: { colorBgContainer, colorBgLayout, borderRadiusLG },
  } = theme.useToken();

  // Save collapsed state to localStorage whenever it changes
  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem('siderCollapsed', String(value));
  };

  // Map pathname to translation key
  const getPageTitleKey = (path: string): string => {
    const route = menuRoutes.find(r => r.key === path);
    return route?.labelKey || 'menu.help';
  };

  // Build menu items from route configuration
  const menuItems: MenuProps['items'] = menuRoutes.map(route => ({
    key: route.key,
    icon: route.icon,
    label: t(route.labelKey),
    onClick: () => router.push(route.key),
  }));

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
        onCollapse={handleCollapse}
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
          backgroundColor: siderColor,
        }}
      >
        <div
          onClick={() => collapsed && handleCollapse(false)}
          style={{
            height: 64,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: collapsed ? 'pointer' : 'default',
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
              marginLeft: 10
            }}
          >
            {/* <DatabaseOutlined style={{ color: 'white', fontSize: 18 }} /> */}
            <LayoutPanelLeft style={{ color: 'white', fontSize: 18 }} />
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
          selectedKeys={[pathname]}
          mode="inline"
          items={menuItems}
          style={{ backgroundColor: siderColor }}
        />
        <div style={{ position: 'absolute', bottom: 50, width: '100%', padding: '0 16px' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={pathname === '/help' ? ['/help'] : []}
            items={[
              {
                key: '/help',
                icon: <QuestionCircleOutlined />,
                label: t('menu.help'),
                onClick: () => router.push('/help'),
              },
            ]}
            style={{ userSelect: 'none', backgroundColor: siderColor }}
          />
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
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
                {!userLoading && currentUser && (
                  <>
                    <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{currentUser.Name || t('user.name')}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{currentUser.Role || t('user.role')}</div>
                    </div>
                    <Avatar
                      src={currentUser.PhotoURL}
                      icon={!currentUser.PhotoURL && <UserOutlined />}
                    />
                  </>
                )}
                {!userLoading && !currentUser && (
                  <>
                    <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t('user.name')}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{t('user.role')}</div>
                    </div>
                    <Avatar icon={<UserOutlined />} />
                  </>
                )}
                {userLoading && (
                  <>
                    <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>...</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>...</div>
                    </div>
                    <Avatar icon={<UserOutlined />} />
                  </>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: 0,
            padding: 24,
            minHeight: 280,
            background: colorBgLayout,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

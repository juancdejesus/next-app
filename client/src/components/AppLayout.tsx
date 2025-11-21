'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Avatar, Dropdown, Badge, Breadcrumb, theme } from 'antd';
import { LayoutPanelLeft } from 'lucide-react';
import {
  QuestionCircleOutlined,
  BellOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { mainRoutes, footerRoutes } from '@/config/routes.config';
import { layoutConfig } from '@/config/layout.config';
import { colors } from '@/config/theme.config';
import { storageKeys } from '@/config/storage.config';
import '../i18n/config';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Initialize collapsed state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem(storageKeys.SIDER_COLLAPSED);
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
    localStorage.setItem(storageKeys.SIDER_COLLAPSED, String(value));
  };

  // Map pathname to translation key
  const getPageTitleKey = (path: string): string => {
    const route = mainRoutes.find(r => r.key === path);
    return route?.labelKey || 'menu.help';
  };

  // Build menu items from route configuration
  const menuItems: MenuProps['items'] = mainRoutes.map(route => ({
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
        width={layoutConfig.sider.width}
        collapsedWidth={layoutConfig.sider.collapsedWidth}
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
            height: layoutConfig.header.height,
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
              background: colors.primary,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 10
            }}
          >
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
            selectedKeys={footerRoutes.some(r => r.key === pathname) ? [pathname] : []}
            items={footerRoutes.map(route => ({
              key: route.key,
              icon: route.icon,
              label: t(route.labelKey),
              onClick: () => router.push(route.key),
            }))}
            style={{ userSelect: 'none', backgroundColor: siderColor }}
          />
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? layoutConfig.sider.collapsedWidth : layoutConfig.sider.width, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: `0 ${layoutConfig.header.padding}px`,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.border.light}`,
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
            <Badge count={layoutConfig.badge.notificationCount}>
              <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            </Badge>
            <QuestionCircleOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                {!userLoading && currentUser && (
                  <>
                    <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{currentUser.Name || t('user.name')}</div>
                      <div style={{ fontSize: 12, color: colors.text.secondary }}>{currentUser.Role || t('user.role')}</div>
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
                      <div style={{ fontSize: 12, color: colors.text.secondary }}>{t('user.role')}</div>
                    </div>
                    <Avatar icon={<UserOutlined />} />
                  </>
                )}
                {userLoading && (
                  <>
                    <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>...</div>
                      <div style={{ fontSize: 12, color: colors.text.secondary }}>...</div>
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
            padding: layoutConfig.content.padding,
            minHeight: layoutConfig.content.minHeight,
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

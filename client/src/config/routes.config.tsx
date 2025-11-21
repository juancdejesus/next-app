import React from 'react';
import {
  DashboardOutlined,
  CloudUploadOutlined,
  FolderOpenOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

/**
 * Route Configuration
 *
 * Centralized route definitions for the application navigation.
 */

/**
 * Route item type definition
 */
export interface RouteItem {
  /**
   * Route path (used as navigation key)
   */
  key: string;

  /**
   * Ant Design icon component
   */
  icon: React.ReactNode;

  /**
   * i18n translation key for the label
   */
  labelKey: string;

  /**
   * Optional description for documentation
   */
  description?: string;
}

/**
 * Main application routes
 * These appear in the primary sidebar navigation
 */
export const mainRoutes: readonly RouteItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    labelKey: 'menu.dashboard',
    description: 'Main dashboard and overview',
  },
  {
    key: '/upload',
    icon: <CloudUploadOutlined />,
    labelKey: 'menu.upload',
    description: 'File upload functionality',
  },
  {
    key: '/jobs',
    icon: <FolderOpenOutlined />,
    labelKey: 'menu.jobs',
    description: 'Job tracking and management',
  },
  {
    key: '/approvals',
    icon: <CheckSquareOutlined />,
    labelKey: 'menu.approvals',
    description: 'Approval workflow management',
  },
  {
    key: '/templates',
    icon: <FileTextOutlined />,
    labelKey: 'menu.templates',
    description: 'Template library',
  },
  {
    key: '/items',
    icon: <AppstoreOutlined />,
    labelKey: 'menu.items',
    description: 'Item management',
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    labelKey: 'menu.users',
    description: 'User management',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    labelKey: 'menu.settings',
    description: 'User preferences and settings',
  },
] as const;

/**
 * Footer/secondary routes
 * These appear at the bottom of the sidebar or in secondary navigation
 */
export const footerRoutes: readonly RouteItem[] = [
  {
    key: '/help',
    icon: <QuestionCircleOutlined />,
    labelKey: 'menu.help',
    description: 'Help and documentation',
  },
] as const;

/**
 * All routes combined
 */
export const allRoutes: readonly RouteItem[] = [...mainRoutes, ...footerRoutes] as const;

/**
 * Route mapping utilities
 */

/**
 * Map route path to menu key
 */
export const routeToKeyMap = Object.fromEntries(
  allRoutes.map((route) => [route.key, route.key])
);

/**
 * Map menu key to route path
 */
export const keyToRouteMap = Object.fromEntries(
  allRoutes.map((route) => [route.key, route.key])
);

/**
 * Get route item by key
 */
export const getRouteByKey = (key: string): RouteItem | undefined => {
  return allRoutes.find((route) => route.key === key);
};

/**
 * Check if a route exists
 */
export const isValidRoute = (key: string): boolean => {
  return allRoutes.some((route) => route.key === key);
};

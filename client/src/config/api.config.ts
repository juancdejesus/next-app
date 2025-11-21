/**
 * API Configuration
 *
 * Centralized API endpoint configuration and base URLs.
 */

/**
 * Get API base URL from environment variables
 * Falls back to default localhost URL if not set
 */
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const fallbackUrl = 'http://localhost:5000/monitor/api';

  return envUrl || fallbackUrl;
};

/**
 * API Configuration object
 */
export const apiConfig = {
  /**
   * Base URL for all API requests
   * Configured via NEXT_PUBLIC_API_URL environment variable
   */
  baseUrl: getApiBaseUrl(),

  /**
   * API base path (used by backend)
   */
  basePath: '/monitor',

  /**
   * API endpoints
   * Relative paths to be appended to baseUrl
   */
  endpoints: {
    // User endpoints
    users: {
      list: '/users',
      getById: (id: string | number) => `/users/${id}`,
      create: '/users',
      update: (id: string | number) => `/users/${id}`,
      delete: (id: string | number) => `/users/${id}`,
      me: '/users/me',
    },

    // Employee endpoints
    employees: {
      list: '/employees',
      getById: (id: string | number) => `/employees/${id}`,
      create: '/employees',
      update: (id: string | number) => `/employees/${id}`,
      delete: (id: string | number) => `/employees/${id}`,
    },

    // Role endpoints
    roles: {
      list: '/roles',
      getById: (id: string | number) => `/roles/${id}`,
    },

    // Add other endpoint groups as needed
    // jobs: { ... },
    // approvals: { ... },
    // templates: { ... },
    // items: { ... },
  },

  /**
   * Request timeout in milliseconds
   */
  timeout: 30000,

  /**
   * Default headers for all requests
   */
  defaultHeaders: {
    'Content-Type': 'application/json',
  },

  /**
   * Enable credentials for cross-origin requests
   */
  withCredentials: true,
} as const;

/**
 * Build full URL for an endpoint
 */
export const buildApiUrl = (endpoint: string): string => {
  const base = apiConfig.baseUrl.endsWith('/')
    ? apiConfig.baseUrl.slice(0, -1)
    : apiConfig.baseUrl;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

export type ApiConfig = typeof apiConfig;

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

export type ApiConfig = typeof apiConfig;

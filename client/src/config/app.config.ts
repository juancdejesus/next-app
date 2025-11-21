/**
 * Application Configuration
 *
 * Central configuration for application metadata, branding, and core settings.
 */

export const appConfig = {
  /**
   * Application display name
   * Used in page titles, headers, and branding
   */
  name: 'Update Hub',

  /**
   * Application description
   * Used in meta tags and page descriptions
   */
  description: 'Enterprise SaaS Data Management Platform',

  /**
   * Application version
   * Semantic versioning (major.minor.patch)
   */
  version: '1.0.0',

  /**
   * Base path for the application
   * Used for routing and asset paths
   */
  basePath: '',

  /**
   * Default page metadata
   */
  metadata: {
    title: 'Update Hub',
    description: 'Enterprise SaaS Data Management Platform',
    keywords: ['enterprise', 'saas', 'data management', 'platform'],
  },
} as const;

export type AppConfig = typeof appConfig;

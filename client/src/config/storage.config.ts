/**
 * Storage Configuration
 *
 * Centralized localStorage key constants to prevent typos and ensure consistency
 * across the application.
 */

export const storageKeys = {
  /**
   * Theme mode key (light/dark)
   * Stores user's preferred theme mode
   */
  THEME: 'theme',

  /**
   * Language preference key (en/es)
   * Stores user's selected language
   */
  LANGUAGE: 'language',

  /**
   * Date format preference key
   * Stores user's preferred date format (MM/DD/YYYY, DD/MM/YYYY, etc.)
   */
  DATE_FORMAT: 'dateFormat',

  /**
   * Sidebar color key
   * Stores user's selected sidebar background color
   */
  SIDER_COLOR: 'siderColor',

  /**
   * Sidebar collapsed state key
   * Stores whether the sidebar is collapsed or expanded
   */
  SIDER_COLLAPSED: 'siderCollapsed',

  /**
   * i18next language key
   * Used by i18next for language persistence
   */
  I18N_LANGUAGE: 'i18nextLng',
} as const;

export type StorageKeys = typeof storageKeys;

/**
 * Helper functions for type-safe localStorage access
 */
export const storage = {
  get: (key: keyof typeof storageKeys): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(storageKeys[key]);
  },

  set: (key: keyof typeof storageKeys, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKeys[key], value);
  },

  remove: (key: keyof typeof storageKeys): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(storageKeys[key]);
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

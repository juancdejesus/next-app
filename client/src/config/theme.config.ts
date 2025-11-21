/**
 * Theme Configuration
 *
 * Centralized theme settings including colors, sidebar palette, and Ant Design tokens.
 */

/**
 * Primary brand colors
 */
export const colors = {
  /**
   * Primary brand color (Ant Design Blue)
   * Used for primary buttons, links, and active states
   */
  primary: '#1677ff',

  /**
   * Default dark sidebar color
   * Traditional dark blue used in Ant Design layouts
   */
  defaultSider: '#001529',

  /**
   * Border colors
   */
  border: {
    light: '#f0f0f0',
    default: '#d9d9d9',
    active: '#1677ff',
  },

  /**
   * Text colors
   */
  text: {
    primary: '#000000',
    secondary: '#8c8c8c',
    disabled: '#bfbfbf',
    inverse: '#ffffff',
  },

  /**
   * Background colors
   */
  background: {
    light: '#ffffff',
    gray: '#f5f5f5',
    dark: '#141414',
  },
} as const;

/**
 * Sidebar color palette
 * Predefined color options for the sidebar customization
 */
export const siderColorPalette = [
  { name: 'Dark Blue', value: '#001529' },
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#141414' },
  { name: 'Slate', value: '#1e293b' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Indigo', value: '#3730a3' },
  { name: 'Purple', value: '#581c87' },
  { name: 'Teal', value: '#115e59' },
  { name: 'Emerald', value: '#065f46' },
  { name: 'Green', value: '#166534' },
  { name: 'Orange', value: '#9a3412' },
  { name: 'Red', value: '#991b1b' },
] as const;

/**
 * Ant Design theme token configuration
 */
export const themeTokens = {
  /**
   * Border radius for components
   */
  borderRadius: 8,

  /**
   * Primary color token
   */
  colorPrimary: colors.primary,

  /**
   * Component-specific token overrides
   */
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f5f5f5',
      siderBg: colors.defaultSider,
    },
    Menu: {
      itemBg: 'transparent',
      darkItemBg: 'transparent',
    },
  },
} as const;

/**
 * Theme mode options
 */
export const themeModes = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type ThemeMode = (typeof themeModes)[keyof typeof themeModes];
export type SiderColorOption = (typeof siderColorPalette)[number];

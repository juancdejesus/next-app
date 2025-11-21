/**
 * Layout Configuration
 *
 * Centralized layout dimensions, spacing, and UI constants.
 */

export const layoutConfig = {
  /**
   * Sidebar (Sider) configuration
   */
  sider: {
    /**
     * Width when expanded
     */
    width: 200,

    /**
     * Width when collapsed
     */
    collapsedWidth: 80,

    /**
     * Breakpoint for responsive collapse
     */
    breakpoint: 'lg' as const,

    /**
     * Trigger size in pixels
     */
    triggerHeight: 48,
  },

  /**
   * Header configuration
   */
  header: {
    /**
     * Header height in pixels
     */
    height: 64,

    /**
     * Header padding (horizontal)
     */
    padding: 24,
  },

  /**
   * Content area configuration
   */
  content: {
    /**
     * Default content padding
     */
    padding: 24,

    /**
     * Minimum height
     */
    minHeight: 280,

    /**
     * Maximum content width (for centered layouts)
     */
    maxWidth: 1200,
  },

  /**
   * Footer configuration
   */
  footer: {
    /**
     * Footer height in pixels
     */
    height: 64,

    /**
     * Footer padding
     */
    padding: 24,
  },

  /**
   * Spacing scale (in pixels)
   * Use these for consistent spacing throughout the app
   */
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  /**
   * Transition durations (in milliseconds)
   */
  transitions: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  /**
   * Z-index layers
   */
  zIndex: {
    dropdown: 1050,
    modal: 1060,
    popover: 1070,
    tooltip: 1080,
  },

  /**
   * Badge configuration
   */
  badge: {
    /**
     * Default notification count for demos/placeholders
     */
    notificationCount: 5,
  },
} as const;

export type LayoutConfig = typeof layoutConfig;

/**
 * Internationalization (i18n) Configuration
 *
 * Centralized configuration for language settings, date formats, and localization.
 */

/**
 * Supported languages
 */
export const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
  },
] as const;

/**
 * Language codes
 */
export const languageCodes = languages.map((lang) => lang.code);

/**
 * Default language
 */
export const defaultLanguage = 'en';

/**
 * Fallback language
 */
export const fallbackLanguage = 'en';

/**
 * Date format options
 */
export const dateFormats = [
  {
    value: 'MM/DD/YYYY',
    label: 'MM/DD/YYYY',
    example: '12/31/2024',
    locale: 'en-US',
  },
  {
    value: 'DD/MM/YYYY',
    label: 'DD/MM/YYYY',
    example: '31/12/2024',
    locale: 'en-GB',
  },
  {
    value: 'YYYY-MM-DD',
    label: 'YYYY-MM-DD',
    example: '2024-12-31',
    locale: 'en-CA',
  },
  {
    value: 'DD.MM.YYYY',
    label: 'DD.MM.YYYY',
    example: '31.12.2024',
    locale: 'de-DE',
  },
] as const;

/**
 * Default date format
 */
export const defaultDateFormat = 'MM/DD/YYYY';

/**
 * i18next configuration options
 */
export const i18nConfig = {
  /**
   * Supported languages
   */
  supportedLanguages: languageCodes,

  /**
   * Default language
   */
  defaultLanguage,

  /**
   * Fallback language when translation is missing
   */
  fallbackLanguage,

  /**
   * Language detection order
   */
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
  },

  /**
   * Namespace configuration
   */
  namespaces: ['translation'],
  defaultNamespace: 'translation',

  /**
   * Debug mode (enable in development)
   */
  debug: process.env.NODE_ENV === 'development',

  /**
   * Interpolation configuration
   */
  interpolation: {
    escapeValue: false, // React already escapes values
  },
} as const;

/**
 * Helper to get language by code
 */
export const getLanguageByCode = (code: string) => {
  return languages.find((lang) => lang.code === code);
};

/**
 * Helper to get date format by value
 */
export const getDateFormatByValue = (value: string) => {
  return dateFormats.find((format) => format.value === value);
};

/**
 * Check if language code is supported
 */
export const isLanguageSupported = (code: string): boolean => {
  return languageCodes.includes(code as any);
};

export type Language = (typeof languages)[number];
export type LanguageCode = (typeof languageCodes)[number];
export type DateFormat = (typeof dateFormats)[number];

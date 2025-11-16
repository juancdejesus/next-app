'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { App, ConfigProvider, theme as antdTheme } from 'antd';

type Theme = 'light' | 'dark';
type DateFormat = 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'mm/dd/yyyy';
type Language = 'en' | 'es';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
  dateFormat: DateFormat;
  setDateFormat: (format: DateFormat) => void;
  siderColor: string;
  setSiderColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguageState] = useState<Language>('en');
  const [dateFormat, setDateFormatState] = useState<DateFormat>('yyyy-mm-dd');
  const [siderColor, setSiderColorState] = useState<string>('#001529');
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedDateFormat = localStorage.getItem('dateFormat') as DateFormat;
    const savedSiderColor = localStorage.getItem('siderColor');

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }

    if (savedDateFormat) {
      setDateFormatState(savedDateFormat);
    }

    if (savedSiderColor) {
      setSiderColorState(savedSiderColor);
    }

    setMounted(true);
  }, []);

  // Save theme to localStorage and update document class
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  // Save language to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language);
    }
  }, [language, mounted]);

  // Save date format to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('dateFormat', dateFormat);
    }
  }, [dateFormat, mounted]);

  // Save sider color to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('siderColor', siderColor);
    }
  }, [siderColor, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setDateFormat = (format: DateFormat) => {
    setDateFormatState(format);
  };

  const setSiderColor = (color: string) => {
    setSiderColorState(color);
  };

  // Ant Design theme configuration
  const antdThemeConfig = {
    algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 8,
    },
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      language,
      setLanguage,
      dateFormat,
      setDateFormat,
      siderColor,
      setSiderColor
    }}>
      <ConfigProvider theme={antdThemeConfig}>
        <App>
          {children}
        </App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

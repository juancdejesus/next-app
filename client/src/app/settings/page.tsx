'use client';

import { Card, Select, Space, App } from 'antd';
import AppLayout from '@/components/AppLayout';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { siderColorPalette } from '@/config/theme.config';
import { colors } from '@/config/theme.config';
import { dateFormats } from '@/config/i18n.config';
import '@/i18n/config';

export default function SettingsPage() {
  const { language, setLanguage, dateFormat, setDateFormat, siderColor, setSiderColor } = useTheme();
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();

  const handleLanguageChange = (value: 'en' | 'es') => {
    setLanguage(value);
    i18n.changeLanguage(value);
    message.success(t('settings.languageChanged'));
  };

  const handleDateFormatChange = (value: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD.MM.YYYY') => {
    setDateFormat(value);
    message.success(t('settings.dateFormatChanged'));
  };

  const handleSiderColorChange = (color: string) => {
    setSiderColor(color);
    message.success(t('settings.siderColorChanged'));
  };

  return (
    <AppLayout>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 24 }}>{t('settings.title')}</h1>

        <Space direction="vertical" size="large" style={{ width: '100%' }} >
          {/* Language and Date Format Settings Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 800 }}>
            {/* Language Settings */}
            <Card title={t('settings.language.title')}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  {t('settings.language.label')}
                </label>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  style={{ width: '100%' }}
                  options={[
                    { label: t('language.english'), value: 'en' },
                    { label: t('language.spanish'), value: 'es' },
                  ]}
                />
              </div>
              <div style={{ marginTop: 8, color: colors.text.secondary, fontSize: 12 }}>
                {t('settings.language.description')}
              </div>
            </Card>

            {/* Date Format Settings */}
            <Card title={t('settings.dateFormat.title')}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  {t('settings.dateFormat.label')}
                </label>
                <Select
                  value={dateFormat}
                  onChange={handleDateFormatChange}
                  style={{ width: '100%' }}
                  options={dateFormats.map((format) => ({
                    label: `${format.label} (${format.example})`,
                    value: format.value,
                  }))}
                />
              </div>
              <div style={{ marginTop: 8, color: colors.text.secondary, fontSize: 12 }}>
                {t('settings.dateFormat.description')}
              </div>
            </Card>
          </div>

          {/* Sider Color Settings */}
          <Card title={t('settings.siderColor.title')} style={{ maxWidth: 800 }}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
                {t('settings.siderColor.label')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginTop: 12 }}>
                {siderColorPalette.map((color) => (
                  <div
                    key={color.value}
                    onClick={() => handleSiderColorChange(color.value)}
                    style={{
                      cursor: 'pointer',
                      padding: 8,
                      borderRadius: 8,
                      border: siderColor === color.value ? `3px solid ${colors.border.active}` : `2px solid ${colors.border.default}`,
                      transition: 'all 0.3s',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: 60,
                        backgroundColor: color.value,
                        borderRadius: 6,
                        marginBottom: 8,
                      }}
                    />
                    <div style={{ fontSize: 12, fontWeight: siderColor === color.value ? 600 : 400 }}>
                      {color.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 8, color: colors.text.secondary, fontSize: 12 }}>
              {t('settings.siderColor.description')}
            </div>
          </Card>
        </Space>
      </div>
    </AppLayout>
  );
}

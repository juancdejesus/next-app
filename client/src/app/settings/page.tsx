'use client';

import { Card, Select, Radio, Space, App } from 'antd';
import AppLayout from '@/components/AppLayout';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

const BASE_COLORS = [
  { name: 'Default Dark', value: '#001529' },
  { name: 'Navy Blue', value: '#1e3a8a' },
  { name: 'Deep Purple', value: '#4a148c' },
  { name: 'Teal', value: '#004d40' },
  { name: 'Forest Green', value: '#1b5e20' },
  { name: 'Crimson', value: '#991b1b' },
  { name: 'Slate', value: '#334155' },
  { name: 'Indigo', value: '#312e81' },
  { name: 'Olive', value: '#3f6212' },
  { name: 'Maroon', value: '#7f1d1d' },
  { name: 'Charcoal', value: '#2d2d2d' },
  { name: 'Midnight Blue', value: '#121063' }
  
];

export default function SettingsPage() {
  const { language, setLanguage, dateFormat, setDateFormat, siderColor, setSiderColor } = useTheme();
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();

  const handleLanguageChange = (value: 'en' | 'es') => {
    setLanguage(value);
    i18n.changeLanguage(value);
    message.success(t('settings.languageChanged'));
  };

  const handleDateFormatChange = (value: 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'mm/dd/yyyy') => {
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
              <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
                {t('settings.language.description')}
              </div>
            </Card>

            {/* Date Format Settings */}
            <Card title={t('settings.dateFormat.title')}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  {t('settings.dateFormat.label')}
                </label>
                <Radio.Group value={dateFormat} onChange={(e) => handleDateFormatChange(e.target.value)}>
                  <Space direction="vertical">
                    <Radio value="yyyy-mm-dd">YYYY-MM-DD (2025-11-15)</Radio>
                    <Radio value="dd/mm/yyyy">DD/MM/YYYY (15/11/2025)</Radio>
                    <Radio value="mm/dd/yyyy">MM/DD/YYYY (11/15/2025)</Radio>
                  </Space>
                </Radio.Group>
              </div>
              <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
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
                {BASE_COLORS.map((color) => (
                  <div
                    key={color.value}
                    onClick={() => handleSiderColorChange(color.value)}
                    style={{
                      cursor: 'pointer',
                      padding: 8,
                      borderRadius: 8,
                      border: siderColor === color.value ? '3px solid #1677ff' : '2px solid #d9d9d9',
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
            <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
              {t('settings.siderColor.description')}
            </div>
          </Card>
        </Space>
      </div>
    </AppLayout>
  );
}

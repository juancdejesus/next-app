import { Input, Button, theme } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface UserToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export const UserToolbar = ({ searchText, onSearchChange, onAddClick }: UserToolbarProps) => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, colorBorderSecondary, colorTextSecondary },
  } = theme.useToken();

  return (
    <div
      style={{
        marginBottom: 10,
        padding: '16px 24px',
        border: `1px solid ${colorBorderSecondary}`,
        borderRadius: '8px',
        backgroundColor: colorBgContainer,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 0 }}>
            {t('users.title')}
          </h1>
          <p style={{ fontSize: 14, color: colorTextSecondary, margin: 0 }}>
            {t('users.description')}
          </p>
        </div>

        <Input
          placeholder={t('users.searchPlaceholder')}
          prefix={<SearchOutlined style={{ color: colorTextSecondary }} />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: '100%', maxWidth: '450px', flex: 1, minWidth: '200px' }}
          allowClear
        />

        <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick} style={{ flexShrink: 0 }}>
          {t('users.addUser')}
        </Button>
      </div>
    </div>
  );
};

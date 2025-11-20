import { Table, Tag, Button, Popconfirm, Tooltip, theme } from 'antd';
import { EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from './UserAvatar';
import { formatLastActive } from '@/utils/userUtils';
import type { User } from '@/services/userService';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onInactivate: (id: number) => void;
}

export const UserTable = ({ users, loading, onEdit, onDelete, onInactivate }: UserTableProps) => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, colorBorderSecondary, colorTextSecondary, colorText },
  } = theme.useToken();

  const columns: ColumnsType<User> = [
    {
      title: t('users.table.user'),
      dataIndex: 'Name',
      key: 'Name',
      onHeaderCell: () => ({
        style: { paddingLeft: '32px' },
      }),
      onCell: () => ({
        style: { paddingLeft: '32px' },
      }),
      render: (_: unknown, record: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserAvatar name={record.Name} photoURL={record.PhotoURL} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500, fontSize: '14px', color: colorText }}>
              {record.Name}
            </span>
            <span style={{ fontSize: '14px', color: colorTextSecondary }}>{record.Email}</span>
          </div>
        </div>
      ),
    },
    {
      title: t('users.table.username'),
      dataIndex: 'Username',
      key: 'Username',
    },
    {
      title: t('users.table.role'),
      dataIndex: 'Role',
      key: 'Role',
      render: (role: string) => {
        if (!role) return '-';
        const color = role.toLowerCase().includes('admin') ? 'blue' : 'cyan';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: t('users.table.lastActive'),
      dataIndex: 'LastActiveTime',
      key: 'LastActiveTime',
      render: (lastActiveTime: Date | null) => formatLastActive(lastActiveTime),
    },
    {
      title: t('users.table.status'),
      dataIndex: 'UserStatus',
      key: 'UserStatus',
      render: (status: string) => (
        <Tag color={status === 'A' ? 'green' : 'red'}>
          {status === 'A' ? t('users.table.active') : t('users.table.inactive')}
        </Tag>
      ),
    },
    {
      title: t('users.table.actions'),
      key: 'actions',
      align: 'right',
      width: 150,
      render: (_: unknown, record: User) => (
        <div
          style={{ display: 'flex', gap: 0, justifyContent: 'flex-end' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title={t('users.table.edit')}>
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Popconfirm
            title={t('users.inactivateConfirmTitle')}
            description={t('users.inactivateConfirmDescription')}
            onConfirm={() => onInactivate(record.Id)}
            okText={t('users.inactivateConfirmOk')}
            cancelText={t('users.inactivateConfirmCancel')}
          >
            <Tooltip title={t('users.table.inactivate')}>
              <Button type="text" icon={<StopOutlined />} style={{ color: '#faad14' }} />
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title={t('users.deleteConfirmTitle')}
            description={t('users.deleteConfirmDescription')}
            onConfirm={() => onDelete(record.Id)}
            okText={t('users.deleteConfirmOk')}
            cancelText={t('users.deleteConfirmCancel')}
          >
            <Tooltip title={t('users.table.delete')}>
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        border: `1px solid ${colorBorderSecondary}`,
        borderRadius: '8px',
        overflow: 'hidden',
        background: colorBgContainer,
      }}
    >
      <Table
        columns={columns}
        dataSource={users}
        rowKey="Id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => t('users.table.total', { count: total }),
          style: { padding: '0px 16px 16px 16px', marginBottom: 0 },
        }}
        onRow={(record) => ({
          style: { cursor: 'pointer' },
          onClick: () => onEdit(record),
        })}
        className="users-table"
        size="middle"
      />
    </div>
  );
};

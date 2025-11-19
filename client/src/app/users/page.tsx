'use client';

import { useEffect, useState } from 'react';
import { App, Table, Spin, Button, Modal, Form, Input, Select, DatePicker, Tag, Popconfirm, Tooltip, Avatar, theme } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StopOutlined, UserOutlined, SearchOutlined, MoreOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/AppLayout';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Helper function to generate avatar color based on name
const getAvatarColor = (name: string): string => {
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Helper function to format last active time
const formatLastActive = (lastActiveTime: Date | null): string => {
  if (!lastActiveTime) return 'Never';
  return dayjs(lastActiveTime).fromNow();
};

interface User {
  Id: number;
  Name: string;
  Username: string;
  Email: string;
  Password: string;
  UserStatus: string;
  OpenDate: Date;
  CloseDate: Date | null;
  LastActiveTime: Date | null;
  Role?: string; // Added for role column
}

interface UserFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  user_status: string;
  open_date: Date;
  close_date: Date | null;
}

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const {
    token: { colorBgContainer, colorBorderSecondary, colorTextSecondary, colorText, colorBgElevated },
  } = theme.useToken(); 
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/users`);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);

      // Apply existing search filter if present
      if (searchText) {
        const filtered = data.filter(
          (user: User) =>
            user.Name?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.Email?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.Username?.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(t('users.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = users.filter(
      (user) =>
        user.Name?.toLowerCase().includes(value.toLowerCase()) ||
        user.Email?.toLowerCase().includes(value.toLowerCase()) ||
        user.Username?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const showModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const showEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: user.Name,
      username: user.Username,
      email: user.Email,
      user_status: user.UserStatus,
      open_date: user.OpenDate ? dayjs(user.OpenDate) : null,
      close_date: user.CloseDate ? dayjs(user.CloseDate) : null,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = {
        id: editingUser ? editingUser.Id : 0,
        name: values.name,
        username: values.username,
        email: values.email,
        password_hash: values.password || (editingUser ? '' : 'default'),
        user_status: values.user_status,
        open_date: values.open_date ? values.open_date.toISOString() : new Date().toISOString(),
        close_date: values.close_date ? values.close_date.toISOString() : null,
      };

      const url = editingUser ? `${apiUrl}/users/${editingUser.Id}` : `${apiUrl}/users`;
      const method = editingUser ? 'PUT' : 'POST';

      console.log(apiUrl)
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(editingUser ? 'Failed to update user' : 'Failed to create user');
      }

      message.success(t(editingUser ? 'users.updateSuccess' : 'users.createSuccess'));
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      message.error(t(editingUser ? 'users.updateError' : 'users.createError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      message.success(t('users.deleteSuccess'));
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error(t('users.deleteError'));
    }
  };

  const handleInactivate = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/users/${id}/inactivate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to inactivate user');
      }

      message.success(t('users.inactivateSuccess'));
      fetchUsers();
    } catch (error) {
      console.error('Error inactivating user:', error);
      message.error(t('users.inactivateError'));
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: t('users.table.user'),
      dataIndex: 'Name',
      key: 'Name',
      // Apply padding to both the header (th) and body (td) cells of this column
      onHeaderCell: () => ({
        style: { paddingLeft: '32px' } // Default 16px + 16px custom
      }),
      onCell: () => ({
        style: { paddingLeft: '32px' } // Default 16px + 16px custom
      }),
      render: (_: unknown, record: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={36}
            style={{ backgroundColor: getAvatarColor(record.Name || 'U'), flexShrink: 0 }}
            // icon={<UserOutlined />} // Using name initial instead
          >
            {record.Name?.charAt(0).toUpperCase()}
          </Avatar>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500, fontSize: '14px', color: colorText }}>{record.Name}</span>
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
        // This is a placeholder for role-based tag colors.
        // You can expand this logic based on your actual roles.
        const color = role.toLowerCase().includes('admin') ? 'blue' : 'cyan';
        return <Tag color={color}>{role}</Tag>;
      }
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
        <div style={{ display: 'flex', gap: 0, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title={t('users.table.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            >
            </Button>
          </Tooltip>
          <Popconfirm
            title={t('users.inactivateConfirmTitle')}
            description={t('users.inactivateConfirmDescription')}
            onConfirm={() => handleInactivate(record.Id)}
            okText={t('users.inactivateConfirmOk')}
            cancelText={t('users.inactivateConfirmCancel')}
          >
            <Tooltip title={t('users.table.inactivate')}>
              <Button
                type="text"
                icon={<StopOutlined />}
                style={{ color: '#faad14' }}
              >
              </Button>
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title={t('users.deleteConfirmTitle')}
            description={t('users.deleteConfirmDescription')}
            onConfirm={() => handleDelete(record.Id)}
            okText={t('users.deleteConfirmOk')}
            cancelText={t('users.deleteConfirmCancel')}
          >
            <Tooltip title={t('users.table.delete')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              >
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ padding: '0 24px 24px 24px' }}>
        {/* Toolbar - Search and Add Button */}
        <div style={{
          marginBottom: 10,
          padding: '16px 24px',
          border: `1px solid ${colorBorderSecondary}`,
          borderRadius: '8px',
          backgroundColor: colorBgContainer,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            {/* Left section: Title and Description */}
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 0 }}>
                {t('users.title')}
              </h1>
              <p style={{ fontSize: 14, color: colorTextSecondary, margin: 0 }}>
                {t('users.description')}
              </p>
            </div>
            {/* Center section: Search Input */}
            <Input
              placeholder={t('users.searchPlaceholder')}
              prefix={<SearchOutlined style={{ color: colorTextSecondary }} />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%', maxWidth: '450px', flex: 1, minWidth: '200px' }}
              allowClear
            />
            {/* Right section: Add Button */}
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ flexShrink: 0 }}>
              {t('users.addUser')}
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Spin spinning={loading}>
          <div style={{ border: `1px solid ${colorBorderSecondary}`, borderRadius: '8px', overflow: 'hidden', background: colorBgContainer }}>
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="Id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => t('users.table.total', { count: total }),
                style: { padding: '0px 16px 16px 16px', marginBottom: 0 }
              }}
              onRow={(record) => ({
                style: { cursor: 'pointer' },
                onClick: () => showEditModal(record),
              })}
              className="users-table"
              size="middle"
              
            />
          </div>
        </Spin>

        <Modal
          title={t(editingUser ? 'users.modal.editTitle' : 'users.modal.title')}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ user_status: 'A' }}
          >
            <Form.Item
              label={t('users.modal.name')}
              name="name"
              rules={[{ required: true, message: t('users.modal.nameRequired') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('users.modal.username')}
              name="username"
              rules={[{ required: true, message: t('users.modal.usernameRequired') }]}
            >
              <Input disabled={!!editingUser} />
            </Form.Item>

            <Form.Item
              label={t('users.modal.email')}
              name="email"
              rules={[
                { required: true, message: t('users.modal.emailRequired') },
                { type: 'email', message: t('users.modal.emailInvalid') }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('users.modal.password')}
              name="password"
              rules={[{ required: !editingUser, message: t('users.modal.passwordRequired') }]}
            >
              <Input.Password placeholder={editingUser ? t('users.modal.passwordPlaceholder') : ''} />
            </Form.Item>

            <Form.Item
              label={t('users.modal.status')}
              name="user_status"
              rules={[{ required: true, message: t('users.modal.statusRequired') }]}
            >
              <Select>
                <Select.Option value="A">{t('users.table.active')}</Select.Option>
                <Select.Option value="I">{t('users.table.inactive')}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={t('users.modal.openDate')}
              name="open_date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={t('users.modal.closeDate')}
              name="close_date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>
                  {t('users.modal.cancel')}
                </Button>
                <Button type="primary" htmlType="submit">
                  {t(editingUser ? 'users.modal.update' : 'users.modal.create')}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
}

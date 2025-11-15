'use client';

import { useEffect, useState } from 'react';
import { App, Table, Card, Spin, Button, Modal, Form, Input, Select, DatePicker, Tag, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/AppLayout';
import dayjs from 'dayjs';

interface User {
  id: number;
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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const { message } = App.useApp(); 
  
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
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(t('users.fetchError'));
    } finally {
      setLoading(false);
    }
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
      name: user.name,
      username: user.username,
      email: user.email,
      user_status: user.user_status,
      open_date: user.open_date ? dayjs(user.open_date) : null,
      close_date: user.close_date ? dayjs(user.close_date) : null,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values: User) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = {
        id: editingUser ? editingUser.id : 0,
        name: values.name,
        username: values.username,
        email: values.email,
        password_hash: values.password || (editingUser ? '' : 'default'),
        user_status: values.user_status,
        open_date: values.open_date ? values.open_date.toISOString() : new Date().toISOString(),
        close_date: values.close_date ? values.close_date.toISOString() : null,
      };

      const url = editingUser ? `${apiUrl}/users/${editingUser.id}` : `${apiUrl}/users`;
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
      title: t('users.table.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t('users.table.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('users.table.username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('users.table.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('users.table.status'),
      dataIndex: 'user_status',
      key: 'user_status',
      render: (status: string) => (
        <Tag color={status === 'A' ? 'green' : 'red'}>
          {status === 'A' ? t('users.table.active') : t('users.table.inactive')}
        </Tag>
      ),
    },
    {
      title: t('users.table.openDate'),
      dataIndex: 'open_date',
      key: 'open_date',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: t('users.table.actions'),
      key: 'actions',
      width: 150,
      render: (_: unknown, record: User) => (
        <div style={{ display: 'flex', gap: 0 }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title={t('users.table.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            >
              {/* {t('users.table.edit')} */}
            </Button>
          </Tooltip>
          <Popconfirm
            title={t('users.inactivateConfirmTitle')}
            description={t('users.inactivateConfirmDescription')}
            onConfirm={() => handleInactivate(record.id)}
            okText={t('users.inactivateConfirmOk')}
            cancelText={t('users.inactivateConfirmCancel')}
          >
            <Tooltip title={t('users.table.inactivate')}>
              <Button
                type="text"
                icon={<StopOutlined />}
                style={{ color: '#faad14' }}
              >
                {/* {t('users.table.inactivate')} */}
              </Button>
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title={t('users.deleteConfirmTitle')}
            description={t('users.deleteConfirmDescription')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('users.deleteConfirmOk')}
            cancelText={t('users.deleteConfirmCancel')}
          >
            <Tooltip title={t('users.table.delete')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              >
                {/* {t('users.table.delete')} */}
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
            {t('users.title')}
          </h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            {t('users.addUser')}
          </Button>
        </div>
        <Card>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => t('users.table.total', { count: total }),
              }}
              onRow={(record) => ({
                style: { cursor: 'pointer' },
                onClick: () => showEditModal(record),
              })}
            />
          </Spin>
        </Card>

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

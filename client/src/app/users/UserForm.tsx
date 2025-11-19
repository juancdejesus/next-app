import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import type { User, UserFormValues, UserRole } from '@/services/userService';
import { fetchRoles } from '@/services/userService';

interface UserFormProps {
  open: boolean;
  editingUser: User | null;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

export const UserForm = ({ open, editingUser, onCancel, onSubmit }: UserFormProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch roles when component mounts
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoadingRoles(true);
        const rolesData = await fetchRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async (values: UserFormValues) => {
    await onSubmit(values);
    form.resetFields();
  };

  // Set form values when editing user changes
  const initialValues = editingUser
    ? {
        name: editingUser.Name,
        username: editingUser.Username,
        email: editingUser.Email,
        user_status: editingUser.UserStatus,
        role_id: editingUser.RoleId,
        open_date: editingUser.OpenDate ? dayjs(editingUser.OpenDate) : null,
        close_date: editingUser.CloseDate ? dayjs(editingUser.CloseDate) : null,
      }
    : { user_status: 'A' };

  return (
    <Modal
      title={t(editingUser ? 'users.modal.editTitle' : 'users.modal.title')}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
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
            { type: 'email', message: t('users.modal.emailInvalid') },
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
          label={t('users.modal.role')}
          name="role_id"
          rules={[{ required: true, message: t('users.modal.roleRequired') }]}
        >
          <Select loading={loadingRoles} placeholder={t('users.modal.rolePlaceholder')}>
            {roles.map((role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.role_name}
              </Select.Option>
            ))}
          </Select>
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

        <Form.Item label={t('users.modal.openDate')} name="open_date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label={t('users.modal.closeDate')} name="close_date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>{t('users.modal.cancel')}</Button>
            <Button type="primary" htmlType="submit">
              {t(editingUser ? 'users.modal.update' : 'users.modal.create')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

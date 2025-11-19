import { Modal, Form, Input, Select, DatePicker, Button, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SolutionOutlined } from '@ant-design/icons';
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

  // Update form fields when editingUser changes or modal opens
  useEffect(() => {
    if (open) {
      if (editingUser) {
        form.setFieldsValue({
          name: editingUser.Name,
          username: editingUser.Username,
          email: editingUser.Email,
          user_status: editingUser.UserStatus,
          role_id: editingUser.RoleId,
          open_date: editingUser.OpenDate ? dayjs(editingUser.OpenDate) : null,
          close_date: editingUser.CloseDate ? dayjs(editingUser.CloseDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingUser, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async (values: UserFormValues) => {
    await onSubmit(values);
    form.resetFields();
  };

  // Set default values for new users
  const initialValues = { user_status: 'A' };

  return (
    <Modal
      title={t(editingUser ? 'users.modal.editTitle' : 'users.modal.title')}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="user-form"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('users.modal.name')}
              name="name"
              rules={[{ required: true, message: t('users.modal.nameRequired') }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('users.modal.username')}
              name="username"
              rules={[{ required: true, message: t('users.modal.usernameRequired') }]}
            >
              <Input prefix={<UserOutlined />} disabled={!!editingUser} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('users.modal.email')}
              name="email"
              rules={[
                { required: true, message: t('users.modal.emailRequired') },
                { type: 'email', message: t('users.modal.emailInvalid') },
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('users.modal.password')}
              name="password"
              rules={[{ required: !editingUser, message: t('users.modal.passwordRequired') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={editingUser ? t('users.modal.passwordPlaceholder') : ''}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('users.modal.role')}
              name="role_id"
              rules={[{ required: true, message: t('users.modal.roleRequired') }]}
            >
              <Select
                loading={loadingRoles}
                placeholder={t('users.modal.rolePlaceholder')}
                suffixIcon={<SolutionOutlined />}
              >
                {roles.map((role) => (
                  <Select.Option key={role.Id} value={role.Id}>
                    {role.RoleName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={t('users.modal.openDate')} name="open_date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('users.modal.closeDate')} name="close_date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button onClick={handleCancel} style={{ minWidth: 120 }}>
              {t('users.modal.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" style={{ minWidth: 120 }}>
              {t(editingUser ? 'users.modal.update' : 'users.modal.create')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

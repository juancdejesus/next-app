import { Modal, Form, Select, Button, Row, Col, Card, Avatar, Typography, Space } from 'antd';
import { UserOutlined, SolutionOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { User, UserFormValues, UserRole } from '@/services/userService';
import type { Employee } from '@/services/employeeService';
import { fetchRoles } from '@/services/userService';
import { fetchEmployeesWithoutAccess } from '@/services/employeeService';

const { Text } = Typography;

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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Fetch roles and employees when component mounts (only for new users)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingRoles(true);
        setLoadingEmployees(true);

        const [rolesData, employeesData] = await Promise.all([
          fetchRoles(),
          editingUser ? Promise.resolve([]) : fetchEmployeesWithoutAccess(),
        ]);

        setRoles(rolesData);
        // Filter to only show active employees
        // const activeEmployees = employeesData.filter(emp => emp.EmployeeStatus === 'A');
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingRoles(false);
        setLoadingEmployees(false);
      }
    };

    if (open) {
      loadData();
    }
  }, [open, editingUser]);

  // Update form fields when editingUser changes or modal opens
  useEffect(() => {
    if (open) {
      if (editingUser) {
        form.setFieldsValue({
          RoleId: editingUser.RoleId,
          UserStatus: editingUser.UserStatus,
        });
      } else {
        form.resetFields();
        setSelectedEmployee(null);
      }
    }
  }, [open, editingUser, form]);

  const handleEmployeeChange = (employeeId: number) => {
    const employee = employees.find((e) => e.Id === employeeId);
    setSelectedEmployee(employee || null);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedEmployee(null);
    onCancel();
  };

  const handleSubmit = async (values: UserFormValues) => {
    await onSubmit(values);
    form.resetFields();
    setSelectedEmployee(null);
  };

  // Set default values for new users
  const initialValues = { UserStatus: 'A' };

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
        {/* Employee Selection (only for new users) */}
        {!editingUser && (
          <>
            <Form.Item
              label="Select Employee"
              name="EmployeeId"
              rules={[{ required: true, message: 'Please select an employee' }]}
            >
              <Select
                showSearch
                loading={loadingEmployees}
                placeholder="Search and select an employee..."
                onChange={handleEmployeeChange}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={employees.map((emp) => ({
                  value: emp.Id,
                  label: `${emp.FullName} (${emp.Email})`,
                  employee: emp,
                }))}
              />
            </Form.Item>

            {/* Employee Preview Card */}
            {selectedEmployee && (
              <Card style={{ marginBottom: 24, backgroundColor: '#fafafa' }}>
                <Space size="middle">
                  <Avatar size={64} src={selectedEmployee.PhotoURL} icon={<UserOutlined />}>
                    {selectedEmployee.FirstName?.[0]}{selectedEmployee.LastName?.[0]}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: 16, display: 'block' }}>
                      {selectedEmployee.FullName}
                    </Text>
                    <Text type="secondary" style={{ display: 'block' }}>
                      {selectedEmployee.Email}
                    </Text>
                    {selectedEmployee.Department && selectedEmployee.JobTitle && (
                      <Text type="secondary" style={{ display: 'block' }}>
                        {selectedEmployee.Department} - {selectedEmployee.JobTitle}
                      </Text>
                    )}
                    {selectedEmployee.DomainUsername && (
                      <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                        {selectedEmployee.DomainUsername}
                      </Text>
                    )}
                  </div>
                </Space>
              </Card>
            )}
          </>
        )}

        {/* Employee Info (read-only for editing) */}
        {editingUser && (
          <Card style={{ marginBottom: 24, backgroundColor: '#f5f5f5' }}>
            <Space size="middle">
              <Avatar size={64} src={editingUser.PhotoURL} icon={<UserOutlined />}>
                {editingUser.FirstName?.[0]}{editingUser.LastName?.[0]}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: 16, display: 'block' }}>
                  {editingUser.Name}
                </Text>
                <Text type="secondary" style={{ display: 'block' }}>
                  {editingUser.Email}
                </Text>
                {editingUser.Department && editingUser.JobTitle && (
                  <Text type="secondary" style={{ display: 'block' }}>
                    {editingUser.Department} - {editingUser.JobTitle}
                  </Text>
                )}
                {editingUser.Username && (
                  <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                    {editingUser.Username}
                  </Text>
                )}
              </div>
            </Space>
          </Card>
        )}

        {/* Role and Status */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('users.modal.role')}
              name="RoleId"
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
              name="UserStatus"
              rules={[{ required: true, message: t('users.modal.statusRequired') }]}
            >
              <Select>
                <Select.Option value="A">{t('users.table.active')}</Select.Option>
                <Select.Option value="I">{t('users.table.inactive')}</Select.Option>
              </Select>
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

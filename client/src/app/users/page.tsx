'use client';

import { useEffect, useState, useMemo } from 'react';
import { Spin } from 'antd';
import AppLayout from '@/components/AppLayout';
import { UserToolbar } from './UserToolbar';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { useUsers } from '@/hooks/useUsers';
import type { User, UserFormValues, CreateUserPayload } from '@/services/userService';

export default function UsersPage() {
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser, inactivateUser } =
    useUsers();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search text
  const filteredUsers = useMemo(() => {
    if (!searchText) return users;

    const searchLower = searchText.toLowerCase();
    return users.filter(
      (user) =>
        user.Name?.toLowerCase().includes(searchLower) ||
        user.Email?.toLowerCase().includes(searchLower) ||
        user.Username?.toLowerCase().includes(searchLower)
    );
  }, [users, searchText]);

  const handleAddClick = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (values: UserFormValues) => {
    const payload: CreateUserPayload = {
      id: editingUser ? editingUser.Id : 0,
      name: values.name,
      username: values.username,
      email: values.email,
      password_hash: values.password || (editingUser ? '' : 'default'),
      user_status: values.user_status,
      open_date: values.open_date ? values.open_date.toISOString() : new Date().toISOString(),
      close_date: values.close_date ? values.close_date.toISOString() : null,
      role_id: values.role_id,
    };

    if (editingUser) {
      await updateUser(editingUser.Id, payload);
    } else {
      await createUser(payload);
    }

    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
  };

  const handleInactivate = async (id: number) => {
    await inactivateUser(id);
  };

  return (
    <AppLayout>
      <div style={{ padding: '0px' }}>
        <UserToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          onAddClick={handleAddClick}
        />

        <Spin spinning={loading}>
          <UserTable
            users={filteredUsers}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onInactivate={handleInactivate}
          />
        </Spin>

        <UserForm
          open={isModalOpen}
          editingUser={editingUser}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
}

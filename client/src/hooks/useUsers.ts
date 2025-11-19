import { useState, useCallback } from 'react';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import * as userService from '@/services/userService';
import type { User, CreateUserPayload } from '@/services/userService';

export const useUsers = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches all users from the API
   * @param showLoading - Whether to show loading state (default: true)
   */
  const fetchUsers = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await userService.fetchUsers();
      setUsers(data);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(t('users.fetchError'));
      return [];
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [message, t]);

  /**
   * Creates a new user
   */
  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      try {
        await userService.createUser(payload);
        message.success(t('users.createSuccess'));
        await fetchUsers(false); // Don't show loading spinner
      } catch (error) {
        console.error('Error creating user:', error);
        message.error(t('users.createError'));
        throw error;
      }
    },
    [fetchUsers, message, t]
  );

  /**
   * Updates an existing user
   */
  const updateUser = useCallback(
    async (id: number, payload: CreateUserPayload) => {
      try {
        await userService.updateUser(id, payload);
        message.success(t('users.updateSuccess'));
        await fetchUsers(false); // Don't show loading spinner
      } catch (error) {
        console.error('Error updating user:', error);
        message.error(t('users.updateError'));
        throw error;
      }
    },
    [fetchUsers, message, t]
  );

  /**
   * Deletes a user by ID
   */
  const deleteUser = useCallback(
    async (id: number) => {
      try {
        await userService.deleteUser(id);
        message.success(t('users.deleteSuccess'));
        await fetchUsers(false); // Don't show loading spinner
      } catch (error) {
        console.error('Error deleting user:', error);
        message.error(t('users.deleteError'));
        throw error;
      }
    },
    [fetchUsers, message, t]
  );

  /**
   * Inactivates a user by ID
   */
  const inactivateUser = useCallback(
    async (id: number) => {
      try {
        await userService.inactivateUser(id);
        message.success(t('users.inactivateSuccess'));
        await fetchUsers(false); // Don't show loading spinner
      } catch (error) {
        console.error('Error inactivating user:', error);
        message.error(t('users.inactivateError'));
        throw error;
      }
    },
    [fetchUsers, message, t]
  );

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    inactivateUser,
  };
};

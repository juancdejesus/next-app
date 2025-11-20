export interface User {
  Id: number;
  EmployeeId: number;
  RoleId?: number;
  UserStatus: string;
  LastActiveTime: Date | null;
  LastLoginTime?: Date | null;
  AccountCreatedDate?: Date;
  // Employee fields (from JOIN)
  EmployeeNumber: string;
  FirstName: string;
  LastName: string;
  Name: string;  // FullName from Employee
  Username: string;  // DomainUsername from Employee
  Email: string;
  PhotoURL?: string;
  Department?: string;
  JobTitle?: string;
  // Role (from JOIN)
  Role?: string;
}

export interface UserFormValues {
  EmployeeId: number;
  RoleId?: number;
  UserStatus: string;
}

export interface CreateUserPayload {
  EmployeeId: number;
  RoleId?: number;
  UserStatus: string;
}

export interface UserRole {
  Id: number;
  RoleName: string;
  Description: string;
  CreatedDate: Date;
}

const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return apiUrl;
};

/**
 * Fetches the current authenticated user from the API
 */
export const getCurrentUser = async (): Promise<User> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/users/me`);

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  return response.json();
};

/**
 * Fetches all users from the API
 */
export const fetchUsers = async (): Promise<User[]> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/users`);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

/**
 * Creates a new user
 */
export const createUser = async (payload: CreateUserPayload): Promise<void> => {
  const apiUrl = getApiUrl();

  const apiPayload = {
    EmployeeId: payload.EmployeeId,
    RoleId: payload.RoleId,
    UserStatus: payload.UserStatus,
  };

  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.Message || 'Failed to create user');
  }
};

/**
 * Updates an existing user
 */
export const updateUser = async (id: number, payload: CreateUserPayload): Promise<void> => {
  const apiUrl = getApiUrl();

  const apiPayload = {
    RoleId: payload.RoleId,
    UserStatus: payload.UserStatus,
  };

  console.log('Update User - API Payload:', apiPayload);

  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }
};

/**
 * Deletes a user by ID
 */
export const deleteUser = async (id: number): Promise<void> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};

/**
 * Inactivates a user by ID
 */
export const inactivateUser = async (id: number): Promise<void> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/users/${id}/inactivate`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to inactivate user');
  }
};

/**
 * Fetches all available user roles
 */
export const fetchRoles = async (): Promise<UserRole[]> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/roles`);

  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }

  return response.json();
};

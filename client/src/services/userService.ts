export interface User {
  Id: number;
  Name: string;
  Username: string;
  Email: string;
  Password: string;
  UserStatus: string;
  OpenDate: Date;
  CloseDate: Date | null;
  LastActiveTime: Date | null;
  RoleId?: number;
  Role?: string;
}

export interface UserFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  user_status: string;
  open_date: Date;
  close_date: Date | null;
  role_id?: number;
}

export interface CreateUserPayload {
  id: number;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  user_status: string;
  open_date: string;
  close_date: string | null;
  role_id?: number;
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
  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }
};

/**
 * Updates an existing user
 */
export const updateUser = async (id: number, payload: CreateUserPayload): Promise<void> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

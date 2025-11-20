export interface User {
  Id: number;
  Name: string;
  Username: string;
  Email: string;
  PhotoURL?: string;
  UserStatus: string;
  LastActiveTime: Date | null;
  RoleId?: number;
  Role?: string;
}

export interface UserFormValues {
  Name: string;
  Username: string;
  Email: string;
  PhotoURL?: string;
  UserStatus: string;
  RoleId?: number;
}

export interface CreateUserPayload {
  Id: number;
  Name: string;
  Username: string;
  Email: string;
  PhotoURL?: string;
  UserStatus: string;
  RoleId?: number;
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

  // Send PascalCase to API (now that backend uses PascalCase)
  const apiPayload = {
    Id: payload.Id,
    Name: payload.Name,
    Username: payload.Username,
    Email: payload.Email,
    PhotoURL: payload.PhotoURL && payload.PhotoURL.trim() !== '' ? payload.PhotoURL : null,
    UserStatus: payload.UserStatus,
    RoleId: payload.RoleId,
  };

  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
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

  // Send PascalCase to API (now that backend uses PascalCase)
  const apiPayload = {
    Id: payload.Id,
    Name: payload.Name,
    Username: payload.Username,
    Email: payload.Email,
    PhotoURL: payload.PhotoURL && payload.PhotoURL.trim() !== '' ? payload.PhotoURL : null,
    UserStatus: payload.UserStatus,
    RoleId: payload.RoleId,
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

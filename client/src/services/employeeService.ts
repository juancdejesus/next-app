const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/monitor/api';
};

export interface Employee {
  Id: number;
  EmployeeNumber: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  DomainUsername?: string;
  Department?: string;
  JobTitle?: string;
  PhoneNumber?: string;
  PhotoURL?: string;
  ManagerId?: number;
  ManagerName?: string;
  HireDate?: Date;
  TerminationDate?: Date;
  EmployeeStatus: string;
  CreatedDate?: Date;
  UpdatedDate?: Date;
}

export const fetchEmployees = async (includeTerminated: boolean = false): Promise<Employee[]> => {
  const apiUrl = getApiUrl();
  const url = includeTerminated
    ? `${apiUrl}/employees?includeTerminated=true`
    : `${apiUrl}/employees`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
};

export const fetchEmployeesWithoutAccess = async (): Promise<Employee[]> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/employees/without-access`);
  if (!response.ok) {
    throw new Error('Failed to fetch employees without access');
  }
  return response.json();
};

export const fetchEmployeeById = async (id: number): Promise<Employee> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/employees/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch employee with ID ${id}`);
  }
  return response.json();
};

export const createEmployee = async (employee: Partial<Employee>): Promise<void> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error('Failed to create employee');
  }
};

export const updateEmployee = async (id: number, employee: Partial<Employee>): Promise<void> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error('Failed to update employee');
  }
};

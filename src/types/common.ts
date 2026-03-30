export type UserRole = 'admin' | 'staff' | 'customer';

export interface OrganizationMembership {
  id: string;
  organization_id: string;
  organization_name: string;
  org_role: 'owner' | 'member';
  permissions: string[];
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  permissions: string[];
  organizations?: OrganizationMembership[];
  active_organization_id?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

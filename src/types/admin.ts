import type { User } from "./auth";

export interface AdminUserGroup {
  id: string;
  name: string;
}

export interface AdminUser extends User {
  status: string;
  groups: AdminUserGroup[];
  extra_permissions: string[];
  organizations: { id: string; name: string; org_role: string }[];
  created_at: string;
}

/** Raw BE response shape */
export interface AdminUsersPagination {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface AdminUsersApiResponse {
  users: AdminUser[];
  pagination: AdminUsersPagination;
}

/** FE-friendly shape used by hooks/components */
export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  page_size: number;
}

/** Params matching BE query expectations */
export interface AdminUsersParams {
  page?: number;
  per_page?: number;
  q?: string;
  role?: string;
  status?: string;
}

export interface InviteUserRequest {
  email: string;
  role: string;
  permission_group_id?: string;
}

export interface AdminGroup {
  id: number;
  name: string;
  description: string;
  member_count: number;
}

export interface AdminGroupsResponse {
  groups: AdminGroup[];
}

/** Detailed user response from GET /admin/users/:id */
export interface AdminUserDetail {
  id: string;
  email: string;
  full_name: string;
  role: string;
  verified: boolean;
  suspended: boolean;
  suspension_reason: string | null;
  extra_permissions: string[];
  groups: { id: string; name: string; permissions: string[] }[];
  organizations: { id: string; name: string; org_role: string; permissions: string[] }[];
  created_at: string;
  updated_at: string;
}

export interface AssignRoleRequest {
  role: string;
}

export interface SuspendUserRequest {
  reason: string;
}

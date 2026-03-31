import type { User } from "./auth";

export interface AdminUser extends User {
  status: string;
  groups: string[];
  last_active: string;
  created_at: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  page_size: number;
}

export interface AdminUsersParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface InviteUserRequest {
  email: string;
  role: string;
  group_id?: string;
  message?: string;
}

export interface AdminGroup {
  id: string;
  name: string;
  description: string;
  member_count: number;
}

export interface AdminGroupsResponse {
  groups: AdminGroup[];
}

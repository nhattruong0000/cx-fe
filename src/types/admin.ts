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
  organization_id?: string;
  org_role?: string;
}

export interface AdminOrganization {
  id: string;
  name: string;
  code: string;
}

export interface AdminOrganizationsResponse {
  organizations: AdminOrganization[];
}

export interface AdminGroup {
  id: number;
  name: string;
  description: string | null;
  scope: "staff";
  permissions: string[];
  member_count: number;
  created_at: string;
}

export interface AdminGroupsResponse {
  groups: AdminGroup[];
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  scope: "staff";
  permissions: string[];
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

/** Staff permission modules grouped for UI display */
export const PERMISSION_MODULES = {
  "Quản lý người dùng": {
    icon: "users",
    color: "#2556C5",
    bg: "#EBF0FA",
    permissions: {
      "users:view": { label: "Xem người dùng", description: "Xem danh sách và hồ sơ người dùng" },
      "users:manage": { label: "Quản lý người dùng", description: "Tạo, sửa, xóa tài khoản người dùng" },
    },
  },
  "Quản lý khảo sát": {
    icon: "clipboard-list",
    color: "#16A34A",
    bg: "#F0FDF4",
    permissions: {
      "survey:create": { label: "Tạo khảo sát", description: "Tạo khảo sát mới" },
      "survey:edit": { label: "Sửa khảo sát", description: "Chỉnh sửa khảo sát hiện có" },
      "survey:delete": { label: "Xóa khảo sát", description: "Xóa khảo sát" },
      "survey:view_responses": { label: "Xem phản hồi", description: "Xem kết quả phản hồi khảo sát" },
    },
  },
  "Phân tích & Báo cáo": {
    icon: "chart-bar",
    color: "#2563EB",
    bg: "#EFF6FF",
    permissions: {
      "analytics:view": { label: "Xem phân tích", description: "Xem dữ liệu phân tích và báo cáo" },
    },
  },
  "Hỗ trợ": {
    icon: "headset",
    color: "#71717A",
    bg: "#F4F4F5",
    permissions: {
      "support:manage": { label: "Quản lý hỗ trợ", description: "Quản lý toàn bộ hệ thống hỗ trợ" },
      "support:update": { label: "Cập nhật hỗ trợ", description: "Cập nhật yêu cầu hỗ trợ" },
      "support:view_all": { label: "Xem tất cả hỗ trợ", description: "Xem tất cả yêu cầu hỗ trợ" },
    },
  },
} as const;

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

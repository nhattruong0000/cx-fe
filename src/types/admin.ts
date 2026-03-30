import type { UserRole } from './common';

export interface PermissionGroup {
  id: number;
  name: string;
  description: string;
  scope: 'staff' | 'customer' | 'both';
  permissions: string[];
  member_count: number;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending';
  groups: { id: number; name: string }[];
  extra_permissions: string[];
  organizations: { id: string; name: string; org_role: string }[];
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  tax_code: string;
  member_count: number;
  status: 'active' | 'inactive';
}

export interface OrganizationDetail extends Organization {
  members: OrganizationMember[];
}

export interface OrganizationMember {
  user_id: number;
  full_name: string;
  email: string;
  org_role: 'owner' | 'member';
  permissions: string[];
}

export interface InviteUserData {
  email: string;
  role: UserRole;
  permission_group_ids: number[];
  organization_id?: string;
  org_role?: 'owner' | 'member';
}

export interface UpdateUserData {
  permission_group_ids: number[];
  extra_permissions: string[];
}

export interface CreateGroupData {
  name: string;
  description: string;
  scope: 'staff' | 'customer' | 'both';
  permissions: string[];
}

/** All available permissions grouped by category */
export const PERMISSION_CATEGORIES = {
  'Khảo sát': [
    'survey:create',
    'survey:edit',
    'survey:delete',
    'survey:view_responses',
    'survey:view',
    'survey:submit',
  ],
  'Hỗ trợ kỹ thuật': [
    'support:manage',
    'support:update',
    'support:view_all',
    'support:create',
    'support:view',
    'support:cancel',
  ],
  'Phân tích': ['analytics:view'],
  'Quản lý': ['users:view', 'users:manage', 'org:manage_members'],
} as const;

import { apiClient } from './client';
import type { PermissionGroup, CreateGroupData } from '@/types/admin';

export const adminGroupsApi = {
  list: async () => {
    const res = await apiClient.get<{ permission_groups: PermissionGroup[] }>('/api/v1/admin/permission-groups');
    return res.permission_groups;
  },

  create: async (data: CreateGroupData) => {
    const res = await apiClient.post<{ permission_group: PermissionGroup }>('/api/v1/admin/permission-groups', data);
    return res.permission_group;
  },

  update: async (id: number, data: Partial<CreateGroupData>) => {
    const res = await apiClient.patch<{ permission_group: PermissionGroup }>(`/api/v1/admin/permission-groups/${id}`, data);
    return res.permission_group;
  },

  delete: (id: number) =>
    apiClient.delete<void>(`/api/v1/admin/permission-groups/${id}`),
};

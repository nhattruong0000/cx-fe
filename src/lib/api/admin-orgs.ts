import { apiClient, mapPagination } from './client';
import type { PaginatedResponse } from '@/types/common';
import type { Organization, OrganizationDetail } from '@/types/admin';

export const adminOrgsApi = {
  list: async (params?: { page?: number; q?: string; status?: string; per_page?: number }) => {
    const res = await apiClient.get<{ organizations: Organization[]; pagination: { current_page: number; total_pages: number; total_count: number } }>('/api/v1/admin/organizations', {
      params: params as Record<string, string>,
    });
    return { data: res.organizations, ...mapPagination(res.pagination) } as PaginatedResponse<Organization>;
  },

  detail: async (id: string) => {
    const res = await apiClient.get<{ organization: OrganizationDetail; members: OrganizationDetail['members'] }>(`/api/v1/admin/organizations/${id}`);
    return { ...res.organization, members: res.members } as OrganizationDetail;
  },

  addMember: (orgId: string, data: { email: string; org_role: string }) =>
    apiClient.post<void>(`/api/v1/admin/organizations/${orgId}/members`, data),

  updateMember: (orgId: string, userId: number, data: { org_role?: string; permissions?: string[] }) =>
    apiClient.patch<void>(`/api/v1/admin/organizations/${orgId}/members/${userId}`, data),

  removeMember: (orgId: string, userId: number) =>
    apiClient.delete<void>(`/api/v1/admin/organizations/${orgId}/members/${userId}`),
};

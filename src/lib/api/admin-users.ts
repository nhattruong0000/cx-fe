import { apiClient, mapPagination } from './client';
import type { PaginatedResponse } from '@/types/common';
import type { AdminUser, InviteUserData, UpdateUserData } from '@/types/admin';

export const adminUsersApi = {
  list: async (params?: { page?: number; per_page?: number; role?: string; q?: string }) => {
    const res = await apiClient.get<{ users: AdminUser[]; pagination: { current_page: number; total_pages: number; total_count: number } }>('/api/v1/admin/users', {
      params: params as Record<string, string>,
    });
    return { data: res.users, ...mapPagination(res.pagination) } as PaginatedResponse<AdminUser>;
  },

  update: async (id: number, data: UpdateUserData) => {
    const res = await apiClient.patch<{ user: AdminUser }>(`/api/v1/admin/users/${id}`, data);
    return res.user;
  },

  invite: (data: InviteUserData) =>
    apiClient.post<void>('/api/v1/admin/invitations', data),

  suspend: (id: number, reason?: string) =>
    apiClient.post<void>(`/api/v1/admin/users/${id}/suspend`, { reason }),

  unsuspend: (id: number) =>
    apiClient.post<void>(`/api/v1/admin/users/${id}/unsuspend`),
};

import { apiClient, mapPagination } from './client';
import type { PaginatedResponse } from '@/types/common';
import type {
  SupportRequest,
  SupportRequestDetail,
  CalendarEvent,
  AssignRequestData,
  StaffCreateSupportRequestData,
  Technician,
} from '@/types/support';

export const supportRequestsApi = {
  list: async (params?: { page?: number; status?: string; q?: string }) => {
    const res = await apiClient.get<{ support_requests: SupportRequest[]; pagination: { current_page: number; total_pages: number; total_count: number } }>('/api/v1/support-requests', {
      params: params as Record<string, string>,
    });
    return { data: res.support_requests, ...mapPagination(res.pagination) } as PaginatedResponse<SupportRequest>;
  },

  calendar: async (params?: { month?: string; year?: string }) => {
    const res = await apiClient.get<{ events: CalendarEvent[] }>('/api/v1/support-requests/calendar', {
      params: params as Record<string, string>,
    });
    return res.events;
  },

  detail: async (id: number) => {
    const res = await apiClient.get<{ support_request: SupportRequestDetail; activity_log: SupportRequestDetail['activity_log'] }>(`/api/v1/support-requests/${id}`);
    return { ...res.support_request, activity_log: res.activity_log } as SupportRequestDetail;
  },

  assign: (id: number, data: AssignRequestData) =>
    apiClient.post<void>(`/api/v1/support-requests/${id}/assign`, data),

  updateStatus: (id: number, data: { new_status: string; result_note?: string }) =>
    apiClient.patch<void>(`/api/v1/support-requests/${id}/status`, data),

  cancel: (id: number, reason: string) =>
    apiClient.post<void>(`/api/v1/support-requests/${id}/cancel`, { reason }),

  create: async (data: StaffCreateSupportRequestData) => {
    const res = await apiClient.post<{ support_request: SupportRequestDetail }>('/api/v1/support-requests', data);
    return res.support_request;
  },

  technicians: async () => {
    const res = await apiClient.get<{ technicians: Technician[] }>('/api/v1/staff/technicians');
    return res.technicians;
  },
};

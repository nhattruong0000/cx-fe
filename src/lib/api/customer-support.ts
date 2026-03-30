import { apiClient } from './client';
import type { SupportRequest, SupportRequestDetail, CreateSupportRequestData } from '@/types/support';

export const customerSupportApi = {
  list: async () => {
    const res = await apiClient.get<{ support_requests: SupportRequest[] }>('/api/v1/customer/support-requests');
    return res.support_requests;
  },

  create: async (data: CreateSupportRequestData) => {
    const res = await apiClient.post<{ support_request: SupportRequest }>('/api/v1/customer/support-requests', data);
    return res.support_request;
  },

  detail: async (id: number) => {
    const res = await apiClient.get<{ support_request: SupportRequestDetail; activity_log: SupportRequestDetail['activity_log'] }>(`/api/v1/customer/support-requests/${id}`);
    return { ...res.support_request, activity_log: res.activity_log } as SupportRequestDetail;
  },

  cancel: (id: number) =>
    apiClient.post<void>(`/api/v1/customer/support-requests/${id}/cancel`),
};

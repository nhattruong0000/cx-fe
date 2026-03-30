import { apiClient } from './client';
import type { DashboardSummary, CustomerDashboard } from '@/types/analytics';

export const dashboardApi = {
  staffSummary: () =>
    apiClient.get<DashboardSummary>('/api/v1/dashboard/summary'),

  customerDashboard: (organizationId?: string) =>
    apiClient.get<CustomerDashboard>('/api/v1/customer/dashboard', {
      params: organizationId ? { organization_id: organizationId } : undefined,
    }),
};

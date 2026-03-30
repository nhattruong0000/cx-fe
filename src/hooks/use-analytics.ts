import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics';
import { dashboardApi } from '@/lib/api/dashboard';

export function useAnalyticsOverview(from?: string, to?: string) {
  return useQuery({
    queryKey: ['analytics-overview', from, to],
    queryFn: () => analyticsApi.overview({ from, to }),
  });
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardApi.staffSummary(),
  });
}

export function useCustomerDashboard(organizationId?: string) {
  return useQuery({
    queryKey: ['customer-dashboard', organizationId],
    queryFn: () => dashboardApi.customerDashboard(organizationId),
  });
}

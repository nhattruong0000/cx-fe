import { apiClient } from './client';
import type { AnalyticsOverview } from '@/types/analytics';

export const analyticsApi = {
  overview: (params?: { from?: string; to?: string }) =>
    apiClient.get<AnalyticsOverview>('/api/v1/analytics/overview', {
      params: params as Record<string, string>,
    }),
};

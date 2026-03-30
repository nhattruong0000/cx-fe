import { apiClient, mapPagination } from './client';
import type { PaginatedResponse } from '@/types/common';
import type {
  Survey,
  SurveyDetail,
  SurveyResponse,
  SurveyStats,
  CreateSurveyData,
} from '@/types/survey';

export const surveysApi = {
  list: async (params?: { page?: number; survey_type?: string; status?: string; q?: string }) => {
    const res = await apiClient.get<{ surveys: Survey[]; pagination: { current_page: number; total_pages: number; total_count: number } }>('/api/v1/surveys', {
      params: params as Record<string, string>,
    });
    return { data: res.surveys, ...mapPagination(res.pagination) } as PaginatedResponse<Survey>;
  },

  detail: async (id: number) => {
    const res = await apiClient.get<{ survey: SurveyDetail }>(`/api/v1/surveys/${id}`);
    return res.survey;
  },

  create: async (data: CreateSurveyData) => {
    const res = await apiClient.post<{ survey: SurveyDetail }>('/api/v1/surveys', data);
    return res.survey;
  },

  update: async (id: number, data: Partial<CreateSurveyData>) => {
    const res = await apiClient.patch<{ survey: SurveyDetail }>(`/api/v1/surveys/${id}`, data);
    return res.survey;
  },

  close: (id: number) =>
    apiClient.patch<void>(`/api/v1/surveys/${id}/close`),

  delete: (id: number) =>
    apiClient.delete<void>(`/api/v1/surveys/${id}`),

  responses: async (id: number, page = 1) => {
    const res = await apiClient.get<{ responses: SurveyResponse[]; pagination: { current_page: number; total_pages: number; total_count: number } }>(`/api/v1/surveys/${id}/responses`, {
      params: { page: String(page) },
    });
    return { data: res.responses, ...mapPagination(res.pagination) } as PaginatedResponse<SurveyResponse>;
  },

  stats: (id: number) =>
    apiClient.get<SurveyStats>(`/api/v1/surveys/${id}/stats`),
};

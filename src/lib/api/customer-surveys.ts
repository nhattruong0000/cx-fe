import { apiClient } from './client';
import type { CustomerSurvey, SurveyDetail, SubmitResponseData } from '@/types/survey';

export const customerSurveysApi = {
  list: async () => {
    const res = await apiClient.get<{ surveys: CustomerSurvey[] }>('/api/v1/customer/surveys');
    return res.surveys;
  },

  detail: async (id: number) => {
    const res = await apiClient.get<{ survey: SurveyDetail; my_response: unknown }>(`/api/v1/customer/surveys/${id}`);
    return { ...res.survey, my_response: res.my_response } as SurveyDetail;
  },

  respond: (id: number, data: SubmitResponseData) =>
    apiClient.post<void>(`/api/v1/customer/surveys/${id}/respond`, data),
};

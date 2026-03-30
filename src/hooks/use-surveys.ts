import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { surveysApi } from '@/lib/api/surveys';
import { customerSurveysApi } from '@/lib/api/customer-surveys';
import type { CreateSurveyData, SubmitResponseData } from '@/types/survey';

// Staff hooks
export function useSurveys(params?: { page?: number; survey_type?: string; status?: string; q?: string }) {
  return useQuery({
    queryKey: ['surveys', params],
    queryFn: () => surveysApi.list(params),
  });
}

export function useSurveyDetail(id: number) {
  return useQuery({
    queryKey: ['survey', id],
    queryFn: () => surveysApi.detail(id),
  });
}

export function useSurveyStats(id: number) {
  return useQuery({
    queryKey: ['survey-stats', id],
    queryFn: () => surveysApi.stats(id),
  });
}

export function useSurveyResponses(id: number, page = 1) {
  return useQuery({
    queryKey: ['survey-responses', id, page],
    queryFn: () => surveysApi.responses(id, page),
  });
}

export function useCreateSurvey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSurveyData) => surveysApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['surveys'] }),
  });
}

export function useCloseSurvey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => surveysApi.close(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['surveys'] });
      qc.invalidateQueries({ queryKey: ['survey'] });
    },
  });
}

// Customer hooks
export function useCustomerSurveys() {
  return useQuery({
    queryKey: ['customer-surveys'],
    queryFn: () => customerSurveysApi.list(),
  });
}

export function useCustomerSurveyDetail(id: number) {
  return useQuery({
    queryKey: ['customer-survey', id],
    queryFn: () => customerSurveysApi.detail(id),
  });
}

export function useSubmitResponse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubmitResponseData }) =>
      customerSurveysApi.respond(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-surveys'] });
      qc.invalidateQueries({ queryKey: ['customer-survey'] });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSurveys,
  getSurvey,
  getResponses,
  createSurvey,
  type SurveyFilters,
  type CreateSurveyInput,
} from "@/lib/api/surveys";

export function useSurveys(page = 1, pageSize = 20, filters?: SurveyFilters) {
  return useQuery({
    queryKey: ["surveys", page, pageSize, filters],
    queryFn: () => getSurveys(page, pageSize, filters),
  });
}

export function useSurvey(id: string) {
  return useQuery({
    queryKey: ["survey", id],
    queryFn: () => getSurvey(id),
    enabled: !!id,
  });
}

export function useResponses(surveyId: string, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["survey-responses", surveyId, page, pageSize],
    queryFn: () => getResponses(surveyId, page, pageSize),
    enabled: !!surveyId,
  });
}

export function useCreateSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSurveyInput) => createSurvey(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}

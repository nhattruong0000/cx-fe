import type { PaginatedResponse } from "@/types/common";
import type { Survey, SurveyResponse, SurveyType } from "@/types/survey";
import {
  getSurveys as fetchSurveys,
  getSurveyById,
  getSurveyResponses as fetchResponses,
} from "./client";
import { mockSurveys } from "./mock-data/surveys";

export interface SurveyFilters {
  type?: SurveyType;
  status?: "active" | "inactive";
  search?: string;
}

export interface CreateSurveyInput {
  title: string;
  type: SurveyType;
  description: string;
  questions: { text: string; type: string; required: boolean; options?: string[] }[];
  triggerPoint: string;
}

export async function getSurveys(
  page = 1,
  pageSize = 20,
  filters?: SurveyFilters,
): Promise<PaginatedResponse<Survey>> {
  const result = await fetchSurveys(page, pageSize);

  if (!filters) return result;

  let filtered = [...mockSurveys];

  if (filters.type) {
    filtered = filtered.filter((s) => s.type === filters.type);
  }
  if (filters.status) {
    filtered = filtered.filter((s) =>
      filters.status === "active" ? s.active : !s.active,
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((s) => s.title.toLowerCase().includes(q));
  }

  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return {
    data,
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

export async function getSurvey(id: string): Promise<Survey | undefined> {
  return getSurveyById(id);
}

export async function getResponses(
  surveyId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<SurveyResponse>> {
  return fetchResponses(surveyId, page, pageSize);
}

export async function createSurvey(input: CreateSurveyInput): Promise<Survey> {
  // Mock: simulate API delay + return created survey
  await new Promise((resolve) => setTimeout(resolve, 500));
  const survey: Survey = {
    id: `srv-${Date.now()}`,
    type: input.type,
    title: input.title,
    description: input.description,
    questions: input.questions.map((q, i) => ({
      id: `q${i + 1}`,
      text: q.text,
      type: q.type as Survey["questions"][number]["type"],
      required: q.required,
      options: q.options,
    })),
    triggerPoint: input.triggerPoint,
    active: true,
    responseCount: 0,
    averageScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return survey;
}

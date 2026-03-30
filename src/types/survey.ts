export type SurveyType = 'CSAT' | 'NPS' | 'CES';
export type SurveyStatus = 'draft' | 'active' | 'closed';
export type QuestionType = 'rating' | 'text' | 'single_choice' | 'multiple_choice';

export interface Survey {
  id: number;
  title: string;
  survey_type: SurveyType;
  description: string;
  status: SurveyStatus;
  target_type: 'all' | 'specific';
  target_org_names: string[];
  question_count: number;
  response_count: number;
  avg_score: number | null;
  created_at: string;
}

export interface Question {
  id: number;
  text: string;
  question_type: QuestionType;
  options: string[];
  required: boolean;
  position: number;
}

export interface SurveyDetail extends Survey {
  questions: Question[];
  target_organizations: { id: string; name: string }[];
}

export interface SurveyResponse {
  id: number;
  survey_id: number;
  user_id: number;
  customer_name: string;
  organization_name: string;
  answers: Record<string, string | number | string[]>;
  score: number | null;
  created_at: string;
}

export interface SurveyStats {
  response_count: number;
  avg_score: number | null;
  response_rate: number;
  trend: { date: string; avg: number }[];
  distribution: { score: number; count: number }[];
}

export interface CreateSurveyData {
  title: string;
  survey_type: SurveyType;
  description: string;
  target_type: 'all' | 'specific';
  target_organization_ids: string[];
  questions: Omit<Question, 'id'>[];
}

export interface CustomerSurvey {
  id: number;
  title: string;
  survey_type: SurveyType;
  description: string;
  question_count: number;
  has_responded: boolean;
  my_score: number | null;
}

export interface SubmitResponseData {
  answers: Record<string, string | number | string[]>;
}

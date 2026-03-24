export type SurveyType = "CSAT" | "CES" | "NPS";

export type QuestionType = "rating" | "text" | "multiple_choice" | "single_choice";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
}

export interface Survey {
  id: string;
  type: SurveyType;
  title: string;
  description: string;
  questions: Question[];
  triggerPoint: string;
  active: boolean;
  responseCount: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  customerName: string;
  score: number;
  comment?: string;
  answers: Record<string, string | number>;
  createdAt: string;
}

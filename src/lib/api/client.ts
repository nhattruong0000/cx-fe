import type { PaginatedResponse } from "@/types/common";
import type { Survey, SurveyResponse } from "@/types/survey";
import type { Agent, Conversation } from "@/types/chat";
import type { ChartDataPoint, DashboardStats, LoyaltyBalance, TierDistribution } from "@/types/analytics";
import type { FunnelStage, JourneyEvent, JourneyStats } from "@/types/journey";
import { mockSurveys, mockSurveyResponses } from "./mock-data/surveys";
import { mockAgents, mockConversations } from "./mock-data/chat";
import {
  mockDashboardStats,
  mockNpsTrend,
  mockCsatTrend,
  mockChatVolumeTrend,
  mockLoyaltyBalances,
  mockTierDistribution,
} from "./mock-data/analytics";
import { mockJourneyEvents, mockFunnelStages, mockJourneyStats } from "./mock-data/journey";

function delay(ms?: number): Promise<void> {
  const time = ms ?? Math.floor(Math.random() * 300) + 200;
  return new Promise((resolve) => setTimeout(resolve, time));
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

// --- Surveys ---

export async function getSurveys(page = 1, pageSize = 10): Promise<PaginatedResponse<Survey>> {
  await delay();
  return paginate(mockSurveys, page, pageSize);
}

export async function getSurveyById(id: string): Promise<Survey | undefined> {
  await delay();
  return mockSurveys.find((s) => s.id === id);
}

export async function getSurveyResponses(surveyId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<SurveyResponse>> {
  await delay();
  const filtered = mockSurveyResponses.filter((r) => r.surveyId === surveyId);
  return paginate(filtered, page, pageSize);
}

// --- Chat ---

export async function getConversations(page = 1, pageSize = 10): Promise<PaginatedResponse<Conversation>> {
  await delay();
  return paginate(mockConversations, page, pageSize);
}

export async function getConversationById(id: string): Promise<Conversation | undefined> {
  await delay();
  return mockConversations.find((c) => c.id === id);
}

export async function getAgents(): Promise<Agent[]> {
  await delay();
  return mockAgents;
}

// --- Analytics ---

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  return mockDashboardStats;
}

export async function getNpsTrend(): Promise<ChartDataPoint[]> {
  await delay();
  return mockNpsTrend;
}

export async function getCsatTrend(): Promise<ChartDataPoint[]> {
  await delay();
  return mockCsatTrend;
}

export async function getChatVolumeTrend(): Promise<ChartDataPoint[]> {
  await delay();
  return mockChatVolumeTrend;
}

export async function getLoyaltyBalances(page = 1, pageSize = 10): Promise<PaginatedResponse<LoyaltyBalance>> {
  await delay();
  return paginate(mockLoyaltyBalances, page, pageSize);
}

export async function getTierDistribution(): Promise<TierDistribution[]> {
  await delay();
  return mockTierDistribution;
}

// --- Journey ---

export async function getJourneyEvents(page = 1, pageSize = 10): Promise<PaginatedResponse<JourneyEvent>> {
  await delay();
  return paginate(mockJourneyEvents, page, pageSize);
}

export async function getFunnelStages(): Promise<FunnelStage[]> {
  await delay();
  return mockFunnelStages;
}

export async function getJourneyStats(): Promise<JourneyStats> {
  await delay();
  return mockJourneyStats;
}

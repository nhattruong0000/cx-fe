"use client";

import type { ChartDataPoint, DashboardStats, TierDistribution } from "@/types/analytics";
import type { FunnelStage, JourneyStats } from "@/types/journey";
import {
  getDashboardStats as fetchDashboardStats,
  getNpsTrend as fetchNpsTrend,
  getCsatTrend as fetchCsatTrend,
  getChatVolumeTrend as fetchChatVolumeTrend,
  getTierDistribution as fetchTierDistribution,
  getFunnelStages as fetchFunnelStages,
  getJourneyStats as fetchJourneyStats,
} from "@/lib/api/client";

// Re-export analytics API functions for use by hooks
// Date range filtering is applied client-side on mock data

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchDashboardStats();
}

export async function getNpsTrend(): Promise<ChartDataPoint[]> {
  return fetchNpsTrend();
}

export async function getCsatBreakdown(): Promise<ChartDataPoint[]> {
  return fetchCsatTrend();
}

export async function getResponseRate(): Promise<ChartDataPoint[]> {
  return fetchChatVolumeTrend();
}

export async function getLoyaltyStats(): Promise<{
  totalMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
}> {
  // Derive from mock data
  return {
    totalMembers: 2500,
    pointsIssued: 125000,
    pointsRedeemed: 45000,
  };
}

export async function getTierDistribution(): Promise<TierDistribution[]> {
  return fetchTierDistribution();
}

export async function getJourneyFunnel(): Promise<FunnelStage[]> {
  return fetchFunnelStages();
}

export async function getJourneyDashboardStats(): Promise<JourneyStats> {
  return fetchJourneyStats();
}

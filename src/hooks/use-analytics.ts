"use client";

import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "@/types/common";
import {
  getDashboardStats,
  getNpsTrend,
  getCsatBreakdown,
  getResponseRate,
  getLoyaltyStats,
  getTierDistribution,
  getJourneyFunnel,
  getJourneyDashboardStats,
} from "@/lib/api/analytics";

function dateRangeKey(dateRange?: DateRange) {
  if (!dateRange) return "all";
  return `${dateRange.from.toISOString()}-${dateRange.to.toISOString()}`;
}

export function useDashboardStats(dateRange?: DateRange) {
  return useQuery({
    queryKey: ["dashboard-stats", dateRangeKey(dateRange)],
    queryFn: getDashboardStats,
  });
}

export function useNpsTrend(dateRange?: DateRange) {
  return useQuery({
    queryKey: ["nps-trend", dateRangeKey(dateRange)],
    queryFn: getNpsTrend,
  });
}

export function useCsatBreakdown(dateRange?: DateRange) {
  return useQuery({
    queryKey: ["csat-breakdown", dateRangeKey(dateRange)],
    queryFn: getCsatBreakdown,
  });
}

export function useResponseRate(dateRange?: DateRange) {
  return useQuery({
    queryKey: ["response-rate", dateRangeKey(dateRange)],
    queryFn: getResponseRate,
  });
}

export function useLoyaltyStats(dateRange?: DateRange) {
  return useQuery({
    queryKey: ["loyalty-stats", dateRangeKey(dateRange)],
    queryFn: getLoyaltyStats,
  });
}

export function useTierDistribution(dateRange?: DateRange) {
  return useQuery({
    queryKey: ["tier-distribution", dateRangeKey(dateRange)],
    queryFn: getTierDistribution,
  });
}

export function useJourneyFunnel() {
  return useQuery({
    queryKey: ["journey-funnel"],
    queryFn: getJourneyFunnel,
  });
}

export function useJourneyStats() {
  return useQuery({
    queryKey: ["journey-stats"],
    queryFn: getJourneyDashboardStats,
  });
}

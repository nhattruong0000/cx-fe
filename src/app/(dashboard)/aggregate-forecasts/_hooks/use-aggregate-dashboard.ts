"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  AggregateDashboardResponse,
  AccuracyResponse,
} from "../_types/aggregate-forecast";

export function useAggregateDashboard() {
  return useQuery({
    queryKey: ["aggregate-forecasts", "dashboard"],
    queryFn: () =>
      apiClient.get<AggregateDashboardResponse>(
        "/api/v2/aggregate-forecasts/dashboard"
      ),
    staleTime: 5 * 60_000,
    retry: 2,
  });
}

export function useAggregateAccuracy(windowDays = 84) {
  return useQuery({
    queryKey: ["aggregate-forecasts", "accuracy", windowDays],
    queryFn: () =>
      apiClient.get<AccuracyResponse>(
        `/api/v2/aggregate-forecasts/accuracy?window_days=${windowDays}`
      ),
    staleTime: 5 * 60_000,
    retry: 2,
  });
}

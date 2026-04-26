"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ForecastHealthResponse } from "../_types/forecast-health";

export function useForecastHealth() {
  return useQuery({
    queryKey: ["forecast-health"],
    queryFn: () =>
      apiClient.get<ForecastHealthResponse>(
        "/api/v2/inventory/forecast-health"
      ),
    staleTime: 60_000,
    retry: 2,
  });
}

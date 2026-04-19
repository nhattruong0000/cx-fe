import { apiClient } from "./client";
import type { OpsSyncStatusResponse, OpsUserStatsResponse } from "@/types/ops";

export function getSyncStatus(): Promise<OpsSyncStatusResponse> {
  return apiClient.get<OpsSyncStatusResponse>("/api/v1/ops/sync_status");
}

export function getUserStats(): Promise<OpsUserStatsResponse> {
  return apiClient.get<OpsUserStatsResponse>("/api/v1/ops/user_stats");
}

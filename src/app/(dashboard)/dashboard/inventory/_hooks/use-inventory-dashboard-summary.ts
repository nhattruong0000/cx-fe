import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardSummary } from "@/lib/api/inventory";
import type { DashboardSummaryParams } from "../_types/dashboard-summary";

const DASHBOARD_SUMMARY_KEY = "inventory-dashboard-summary";

export function useInventoryDashboardSummary(
  params: DashboardSummaryParams = {}
) {
  return useQuery({
    queryKey: [DASHBOARD_SUMMARY_KEY, params],
    queryFn: () => getDashboardSummary(params),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

/** Invalidate the dashboard summary cache — call on manual refresh actions */
export function useInvalidateDashboardSummary() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [DASHBOARD_SUMMARY_KEY] });
}

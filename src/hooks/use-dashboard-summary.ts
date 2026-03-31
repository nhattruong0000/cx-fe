import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/lib/api/dashboard";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
    staleTime: 300_000, // 5 min — aligned with refetchInterval
    refetchInterval: 300_000, // 5 min
    retry: 2,
  });
}

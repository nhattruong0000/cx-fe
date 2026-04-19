import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/lib/api/ops";

const USER_STATS_KEY = "ops-user-stats";

export function useOpsUserStats() {
  return useQuery({
    queryKey: [USER_STATS_KEY],
    queryFn: () => getUserStats(),
    refetchInterval: 5 * 60_000,
    staleTime: 4 * 60_000,
    placeholderData: (prev) => prev,
  });
}

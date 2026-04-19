import { useQuery } from "@tanstack/react-query";
import { getSyncStatus } from "@/lib/api/ops";

const SYNC_STATUS_KEY = "ops-sync-status";

export function useOpsSyncStatus() {
  return useQuery({
    queryKey: [SYNC_STATUS_KEY],
    queryFn: () => getSyncStatus(),
    refetchInterval: 30_000,
    staleTime: 25_000,
    placeholderData: (prev) => prev,
  });
}

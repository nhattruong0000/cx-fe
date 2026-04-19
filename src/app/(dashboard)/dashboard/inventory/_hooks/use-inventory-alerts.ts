import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acknowledgeAlert, getAlerts } from "@/lib/api/inventory";
import type { AlertListParams } from "@/types/inventory";

const ALERTS_KEY = "inventory-alerts";

export function useInventoryAlerts(params: AlertListParams = {}) {
  return useQuery({
    queryKey: [ALERTS_KEY, params],
    queryFn: () => getAlerts(params),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

export function useAcknowledgeAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acknowledgeAlert(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ALERTS_KEY] });
    },
  });
}

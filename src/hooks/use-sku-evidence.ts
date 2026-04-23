import { useQuery } from "@tanstack/react-query";
import { fetchSkuEvidence } from "@/lib/api/inventory";
import type { EvidenceParams } from "@/types/inventory-evidence";

/**
 * Query hook for GET /api/v1/inventory/items/:code/evidence.
 * Query key: ['inventory', 'items', code, 'evidence', params]
 *
 * staleTime 30s — avoids re-fetch when reopening drawer for the same SKU
 * within a short browsing session. Drawer + detail page share the same key,
 * so only one network call is made.
 *
 * Accepts null code to allow conditional usage (enabled: !!code).
 */
export function useSkuEvidence(
  code: string | null,
  params: EvidenceParams = {}
) {
  return useQuery({
    queryKey: ["inventory", "items", code, "evidence", params],
    queryFn: () => fetchSkuEvidence(code!, params),
    enabled: !!code,
    staleTime: 30_000,
    retry: 2,
  });
}

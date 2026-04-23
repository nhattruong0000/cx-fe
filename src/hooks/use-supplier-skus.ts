import { useQuery } from "@tanstack/react-query";
import { fetchSupplierSkus } from "@/lib/api/inventory";
import type { SupplierSkusParams } from "@/types/inventory";

/**
 * Query hook for GET /api/v1/inventory/suppliers/:id/skus (cursor-paginated).
 * Query key: ['inventory', 'suppliers', id, 'skus', params]
 */
export function useSupplierSkus(id: string, params: SupplierSkusParams = {}) {
  return useQuery({
    queryKey: ["inventory", "suppliers", id, "skus", params],
    queryFn: () => fetchSupplierSkus(id, params),
    staleTime: 60_000,
    enabled: !!id,
    retry: 2,
  });
}

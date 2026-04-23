import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers } from "@/lib/api/inventory";
import type { SuppliersListParams } from "@/types/inventory";

/**
 * Query hook for GET /api/v1/inventory/suppliers (cursor-paginated list).
 * Query key: ['inventory', 'suppliers', params]
 */
export function useInventorySuppliers(params: SuppliersListParams = {}) {
  return useQuery({
    queryKey: ["inventory", "suppliers", params],
    queryFn: () => fetchSuppliers(params),
    staleTime: 60_000,
    retry: 2,
  });
}

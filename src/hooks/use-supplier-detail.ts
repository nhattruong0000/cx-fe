import { useQuery } from "@tanstack/react-query";
import { fetchSupplierDetail } from "@/lib/api/inventory";

/**
 * Query hook for GET /api/v1/inventory/suppliers/:id (detail).
 * Query key: ['inventory', 'suppliers', id, 'detail']
 */
export function useSupplierDetail(id: string) {
  return useQuery({
    queryKey: ["inventory", "suppliers", id, "detail"],
    queryFn: () => fetchSupplierDetail(id),
    staleTime: 60_000,
    enabled: !!id,
    retry: 2,
  });
}

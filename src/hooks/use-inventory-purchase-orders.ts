import { useQuery } from "@tanstack/react-query";
import { fetchPurchaseOrders } from "@/lib/api/inventory";
import type { PurchaseOrdersListParams } from "@/types/inventory";

/**
 * Query hook for GET /api/v1/inventory/purchase-orders (cursor-paginated list).
 * Query key: ['inventory', 'purchase-orders', params]
 */
export function useInventoryPurchaseOrders(params: PurchaseOrdersListParams = {}) {
  return useQuery({
    queryKey: ["inventory", "purchase-orders", params],
    queryFn: () => fetchPurchaseOrders(params),
    staleTime: 60_000,
    retry: 2,
  });
}

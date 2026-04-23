import { useQuery } from "@tanstack/react-query";
import { fetchStockList } from "@/lib/api/inventory";
import type { StockListParams } from "@/types/inventory";

/**
 * Query hook for GET /api/v1/inventory/stock (cursor-paginated list).
 * Query key: ['inventory', 'stock', params]
 */
export function useInventoryStockList(params: StockListParams = {}) {
  return useQuery({
    queryKey: ["inventory", "stock", params],
    queryFn: () => fetchStockList(params),
    staleTime: 60_000,
    retry: 2,
  });
}

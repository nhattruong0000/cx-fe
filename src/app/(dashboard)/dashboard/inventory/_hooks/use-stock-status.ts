import { useQueries, useQuery } from "@tanstack/react-query";
import { getStockStatus } from "@/lib/api/inventory";
import type { StockStatusParams, StockStatusResponse } from "@/types/inventory";

const STOCK_KEY = "inventory-stock-status";

export function useStockStatus(code: string | null, params: StockStatusParams = {}) {
  return useQuery({
    queryKey: [STOCK_KEY, code, params],
    queryFn: () => getStockStatus(code as string, params),
    enabled: Boolean(code),
    staleTime: 60_000,
  });
}

/** Parallel load stock_status for a list of SKUs. Phase 1 limit caller-side (≤ 50). */
export function useStockStatusBatch(
  codes: string[],
  params: StockStatusParams = {}
) {
  return useQueries({
    queries: codes.map((code) => ({
      queryKey: [STOCK_KEY, code, params],
      queryFn: () => getStockStatus(code, params),
      staleTime: 60_000,
    })),
    combine: (results) => ({
      data: results
        .map((r) => r.data)
        .filter((d): d is StockStatusResponse => Boolean(d)),
      isLoading: results.some((r) => r.isLoading),
      isError: results.some((r) => r.isError),
      errors: results.map((r) => r.error).filter(Boolean),
    }),
  });
}

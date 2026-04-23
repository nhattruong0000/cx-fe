import { useQuery } from "@tanstack/react-query";
import { fetchSkuForecast } from "@/lib/api/inventory";

/**
 * Query hook for GET /api/v1/inventory/items/:code/forecast (per-SKU).
 * Query key: ['inventory', 'items', code, 'forecast', horizons]
 * Accepts null code to allow conditional usage (enabled: !!code).
 */
export function useSkuForecast(code: string | null, horizons?: number[]) {
  return useQuery({
    queryKey: ["inventory", "items", code, "forecast", horizons],
    queryFn: () => fetchSkuForecast(code!, horizons),
    staleTime: 5 * 60_000,
    enabled: !!code,
    retry: 2,
  });
}

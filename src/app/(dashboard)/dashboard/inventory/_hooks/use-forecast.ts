import { useQuery } from "@tanstack/react-query";
import { getForecast } from "@/lib/api/inventory";
import type { ForecastParams } from "@/types/inventory";

const FORECAST_KEY = "inventory-forecast";

export function useForecast(code: string | null, params: ForecastParams = {}) {
  return useQuery({
    queryKey: [FORECAST_KEY, code, params],
    queryFn: () => getForecast(code as string, params),
    enabled: Boolean(code),
    staleTime: 120_000,
  });
}

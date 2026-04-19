import { apiClient } from "./client";
import type {
  AlertListParams,
  AlertListResponse,
  ForecastParams,
  ForecastResponse,
  InventoryAlert,
  StockStatusParams,
  StockStatusResponse,
} from "@/types/inventory";

function buildQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const v of value) search.append(key, String(v));
    } else {
      search.append(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function getAlerts(params: AlertListParams = {}): Promise<AlertListResponse> {
  return apiClient.get<AlertListResponse>(
    `/api/v1/inventory/alerts${buildQuery(params as Record<string, unknown>)}`
  );
}

export function acknowledgeAlert(id: string): Promise<InventoryAlert> {
  return apiClient.post<InventoryAlert>(`/api/v1/inventory/alerts/${id}/acknowledge`);
}

export function getStockStatus(
  code: string,
  params: StockStatusParams = {}
): Promise<StockStatusResponse> {
  const query: Record<string, unknown> = {};
  if (params.branch_id) query.branch_id = params.branch_id;
  if (params.diagnostics) query.diagnostics = 1;
  return apiClient.get<StockStatusResponse>(
    `/api/v1/inventory/items/${encodeURIComponent(code)}/stock_status${buildQuery(query)}`
  );
}

export function getForecast(
  code: string,
  params: ForecastParams = {}
): Promise<ForecastResponse> {
  const query: Record<string, unknown> = {};
  if (params.horizons && params.horizons.length > 0) {
    query.horizons = params.horizons.join(",");
  }
  if (params.branch_id) query.branch_id = params.branch_id;
  return apiClient.get<ForecastResponse>(
    `/api/v1/inventory/items/${encodeURIComponent(code)}/forecast${buildQuery(query)}`
  );
}

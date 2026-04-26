import { apiClient } from "./client";
import type {
  AlertListParams,
  AlertListResponse,
  CursorPage,
  ForecastResponse,
  InventoryAlert,
  PurchaseOrderListItem,
  PurchaseOrdersListParams,
  StockListItem,
  StockListParams,
  WarehouseOption,
  SupplierDetail,
  SupplierListItem,
  SupplierSkuItem,
  SupplierSkusParams,
  SupplierUpdateResponse,
  SuppliersListParams,
} from "@/types/inventory";
import type {
  EvidenceParams,
  InventoryEvidenceBundle,
} from "@/types/inventory-evidence";
import type {
  DashboardSummaryParams,
  InventoryDashboardSummary,
} from "@/app/(dashboard)/dashboard/inventory/_types/dashboard-summary";

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

export function getDashboardSummary(
  params: DashboardSummaryParams = {}
): Promise<InventoryDashboardSummary> {
  const query: Record<string, unknown> = {};
  if (params.branch_id) query.branch_id = params.branch_id;
  // Migrated V1 → V2 (Phase 2 FE migration). V2 returns same shape via shared
  // DashboardSummaryQuery; FE consumers don't need shape changes.
  return apiClient.get<InventoryDashboardSummary>(
    `/api/v2/inventory/dashboard-summary${buildQuery(query)}`
  );
}

// ─── Stock list ───────────────────────────────────────────────────────────────

export function fetchStockList(
  params: StockListParams = {}
): Promise<CursorPage<StockListItem>> {
  return apiClient.get<CursorPage<StockListItem>>(
    `/api/v1/inventory/stocks${buildQuery(params as Record<string, unknown>)}`
  );
}

/** Fetch warehouse list for filter dropdown. */
export function fetchWarehouses(): Promise<{ data: WarehouseOption[] }> {
  return apiClient.get<{ data: WarehouseOption[] }>(`/api/v1/inventory/warehouses`);
}

// ─── Suppliers list ───────────────────────────────────────────────────────────

export function fetchSuppliers(
  params: SuppliersListParams = {}
): Promise<CursorPage<SupplierListItem>> {
  return apiClient.get<CursorPage<SupplierListItem>>(
    `/api/v1/inventory/suppliers${buildQuery(params as Record<string, unknown>)}`
  );
}

// ─── Supplier detail ─────────────────────────────────────────────────────────

export function fetchSupplierDetail(id: string): Promise<SupplierDetail> {
  return apiClient.get<SupplierDetail>(
    `/api/v1/inventory/suppliers/${encodeURIComponent(id)}`
  );
}

/** PATCH /api/v1/inventory/suppliers/:id — upsert vendor lead_time_days override.
 *  Backend enforces permission `inventory:vendor_lead_time_manage`; 403 otherwise. */
export function updateSupplierLeadTime(
  id: string,
  leadTimeDays: number
): Promise<SupplierUpdateResponse> {
  return apiClient.patch<SupplierUpdateResponse>(
    `/api/v1/inventory/suppliers/${encodeURIComponent(id)}`,
    { supplier: { lead_time_days: leadTimeDays } }
  );
}

export function fetchSupplierSkus(
  id: string,
  params: SupplierSkusParams = {}
): Promise<CursorPage<SupplierSkuItem>> {
  return apiClient.get<CursorPage<SupplierSkuItem>>(
    `/api/v1/inventory/suppliers/${encodeURIComponent(id)}/skus${buildQuery(params as Record<string, unknown>)}`
  );
}

// ─── Per-SKU forecast ─────────────────────────────────────────────────────────

/** Fetch forecast data for a single SKU code.
 *  Migrated V1 → V2 (Sub-A Phase 2). V2 returns native v2 shape (daily_rate, ROP,
 *  classification, ...). FE-side adapter `expandV2ToLegacy3Horizon` synthesizes
 *  legacy 3-horizon ForecastPoint[] for backward compat with supplier dialog.
 *  When the supplier dialog is later refactored to use ForecastActionCard,
 *  this shim can be dropped.
 *
 *  horizons param accepted for compat but ignored — BE V2 returns up to 30 latest. */
export function fetchSkuForecast(
  code: string,
  horizons?: number[]
): Promise<ForecastResponse> {
  void horizons;
  return apiClient
    .get<{ item_code: string; data: V2ForecastRow[] }>(
      `/api/v2/inventory/items/${encodeURIComponent(code)}/forecast`
    )
    .then((res) => ({
      item_code: res.item_code,
      data: expandV2ToLegacy3Horizon(res.item_code, res.data),
    }));
}

// V2 forecast row shape returned by /api/v2/inventory/items/:code/forecast
// (matches Api::V2::InventoryForecastSerializer WHITELISTED_KEYS).
type V2ForecastRow = {
  item_code: string;
  stock_code: string;
  branch_id: string;
  forecast_date: string;
  daily_rate: number | null;
  weekly_demand: number | null;
  rop: number | null;
  safety_stock: number | null;
  reorder_qty_suggestion: number | null;
  lead_time_p50_days: number | null;
  lead_time_p90_days: number | null;
  classification: string | null;
  method: string | null;
  window_days: number | null;
  data_quality: string | null;
  days_with_data: number | null;
  confidence: number | null;
  confidence_source: string | null;
};

const LEGACY_HORIZONS = [7, 30, 90] as const;

// Synthesize 3-horizon ForecastPoint[] from 1 v2 row (mirrors BE LegacyResponseAdapter).
// Used by supplier dialog (forecast-evidence-utils) until that dialog is refactored
// to consume v2 fields directly.
function expandV2ToLegacy3Horizon(itemCode: string, rows: V2ForecastRow[]) {
  const latest = rows[0];
  if (!latest) return [];
  const dailyRate = latest.daily_rate ?? 0;
  const isLowConfidence = latest.confidence == null || latest.confidence < 0.5;
  return LEGACY_HORIZONS.map((h) => ({
    id: `${latest.item_code}-${latest.forecast_date}-${h}`,
    item_code: itemCode,
    stock_code: latest.stock_code,
    branch_id: latest.branch_id,
    forecast_date: latest.forecast_date,
    horizon_days: h,
    qty_forecast: Math.round(dailyRate * h),
    qty_lower: latest.confidence != null
      ? Math.round(dailyRate * h * (1 - (1 - latest.confidence) * 0.5))
      : null,
    qty_upper: latest.confidence != null
      ? Math.round(dailyRate * h * (1 + (1 - latest.confidence) * 0.5))
      : null,
    method: latest.method ?? "rolling_avg",
    low_confidence: isLowConfidence,
    created_at: latest.forecast_date,
  }));
}

// ─── Purchase Orders list ─────────────────────────────────────────────────────

export function fetchPurchaseOrders(
  params: PurchaseOrdersListParams = {}
): Promise<CursorPage<PurchaseOrderListItem>> {
  return apiClient.get<CursorPage<PurchaseOrderListItem>>(
    `/api/v1/inventory/purchase-orders${buildQuery(params as Record<string, unknown>)}`
  );
}

// ─── Per-SKU evidence bundle ──────────────────────────────────────────────────

/** Fetch full evidence bundle for a single SKU code.
 *  Migrated V1 → V2 (Sub-A Phase 2). V2 controller delegates to the same
 *  EvidenceBundleQuery + EvidenceBundleSerializer, so response shape is
 *  identical. Switch enables Phase 3 BE adapter drop. */
export function fetchSkuEvidence(
  code: string,
  params: EvidenceParams = {}
): Promise<InventoryEvidenceBundle> {
  return apiClient.get<InventoryEvidenceBundle>(
    `/api/v2/inventory/items/${encodeURIComponent(code)}/evidence${buildQuery(params as Record<string, unknown>)}`
  );
}

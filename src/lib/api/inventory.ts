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
  return apiClient.get<InventoryDashboardSummary>(
    `/api/v1/inventory/dashboard-summary${buildQuery(query)}`
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
 *  Uses existing GET /api/v1/inventory/items/:code/forecast endpoint.
 *  horizons: array of [7, 30, 90] — omit to fetch all. */
export function fetchSkuForecast(
  code: string,
  horizons?: number[]
): Promise<ForecastResponse> {
  const q = horizons?.length ? `?horizons=${horizons.join(",")}` : "";
  return apiClient.get<ForecastResponse>(
    `/api/v1/inventory/items/${encodeURIComponent(code)}/forecast${q}`
  );
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
 *  GET /api/v1/inventory/items/:code/evidence?branch_id=... */
export function fetchSkuEvidence(
  code: string,
  params: EvidenceParams = {}
): Promise<InventoryEvidenceBundle> {
  return apiClient.get<InventoryEvidenceBundle>(
    `/api/v1/inventory/items/${encodeURIComponent(code)}/evidence${buildQuery(params as Record<string, unknown>)}`
  );
}

import { apiClient } from "./client";
import type {
  AlertListParams,
  AlertListResponse,
  CursorPage,
  InventoryAlert,
  PurchaseOrderListItem,
  PurchaseOrdersListParams,
  StockListItem,
  StockListParams,
  StockStatusParams,
  StockStatusResponseV2,
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

/** Migrated V1 → V2 (Phase 2 FE migration). V2 endpoint returns native v2 fields. */
export function fetchSupplierSkus(
  id: string,
  params: SupplierSkusParams = {}
): Promise<CursorPage<SupplierSkuItem>> {
  return apiClient.get<CursorPage<SupplierSkuItem>>(
    `/api/v2/inventory/suppliers/${encodeURIComponent(id)}/skus${buildQuery(params as Record<string, unknown>)}`
  );
}

// ─── Per-SKU V2 stock status ──────────────────────────────────────────────────

/** Fetch V2 stock status for a single SKU code.
 *  GET /api/v2/inventory/items/:code/stock_status
 *  Returns native v2 fields: dus, status_band, projected_qty, latest_forecasts[0] with
 *  daily_rate/rop/classification/confidence. */
export function fetchSkuStockStatus(
  code: string,
  params: StockStatusParams = {}
): Promise<StockStatusResponseV2> {
  return apiClient.get<StockStatusResponseV2>(
    `/api/v2/inventory/items/${encodeURIComponent(code)}/stock_status${buildQuery(params as Record<string, unknown>)}`
  );
}

/** Batch fetch V2 stock status for multiple SKU codes.
 *  GET /api/v2/inventory/items/stock_status?item_codes=A,B,C */
export function fetchSkuStockStatusBatch(
  codes: string[],
  params: StockStatusParams = {}
): Promise<StockStatusResponseV2[]> {
  const query = buildQuery({
    ...params as Record<string, unknown>,
    item_codes: codes.join(","),
  });
  return apiClient.get<StockStatusResponseV2[]>(
    `/api/v2/inventory/items/stock_status${query}`
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

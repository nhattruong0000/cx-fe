export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "open" | "acknowledged" | "resolved";

export interface AlertSupplyBreakdown {
  on_hand?: number;
  on_order_total?: number;
  on_order_within_lead_time?: number;
  effective_supply?: number;
}

export interface AlertPoSummary {
  po_count?: number;
  overdue_count?: number;
  overdue_po_list?: Array<{
    pu_order_id: string;
    open_qty?: number;
    eta_date?: string | null;
    days_to_eta?: number | null;
    is_overdue?: boolean;
  }>;
}

export interface AlertContext {
  supply_breakdown?: AlertSupplyBreakdown | null;
  po_summary?: AlertPoSummary | null;
  alert_reliability?: { score?: number; [k: string]: unknown } | null;
  on_hand_source?: string;
  lead_time_days?: number;
  thresholds?: Record<string, number>;
}

export interface InventoryAlert {
  id: string;
  item_code: string;
  /** SKU code — returned by BE list endpoint (mirrors item_code) */
  sku_code?: string;
  /** SKU display name — returned by BE list endpoint */
  sku_name?: string | null;
  stock_code: string | null;
  branch_id: string;
  /** Branch display name — returned by BE list endpoint */
  branch_name?: string | null;
  alert_type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  on_hand: number | null;
  days_of_supply: number | null;
  reorder_point: number | null;
  message: string;
  fingerprint: string;
  context: AlertContext;
  detected_at: string;
  notified_at: string | null;
  acknowledged_at: string | null;
  acknowledged_by_user_id: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface AlertListMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  /** Open alert counts by severity — provided by BE list endpoint */
  counts?: {
    open?: number;
    critical?: number;
    warning?: number;
    info?: number;
  };
}

export interface AlertListResponse {
  data: InventoryAlert[];
  meta: AlertListMeta;
}

export interface AlertListParams {
  severity?: string;
  alert_type?: string;
  status?: string;
  branch_id?: number | string;
  /** Full-text search by SKU code (q param) */
  q?: string;
  per_page?: number;
  page?: number;
}

export interface StockOnHandByStock {
  stock_code: string;
  stock_name?: string | null;
  qty: number;
}

/** V2 latest forecast row inside StockStatusResponseV2.latest_forecasts (array length 1). */
export interface StockLatestForecastV2 {
  daily_rate: number | null;
  rop: number | null;
  safety_stock: number | null;
  classification: string | null;
  method: string | null;
  confidence: number | null;
  forecast_date: string;
  reorder_qty_suggestion: number | null;
}

export interface StockPurchaseOrder {
  pu_order_id: string;
  refdate: string | null;
  open_qty: number | null;
  eta_date: string | null;
  days_to_eta: number | null;
  is_overdue: boolean;
}

export interface StockInwardCadence {
  avg_gap_days: number | null;
  stdev_gap_days: number | null;
  days_since_last_inward: number | null;
  sample_size: number | null;
  last_inward_at: string | null;
}

export interface StockSupplyBreakdown {
  on_hand: number;
  on_order_total: number;
  on_order_within_lead_time: number;
  effective_supply: number;
}

export interface StockRecentDemand {
  window_days?: number;
  total_qty?: number;
  avg_daily_qty?: number;
}

/** V2 stock status response from GET /api/v2/inventory/items/:code/stock_status */
export interface StockStatusResponseV2 {
  item_code: string;
  branch_id: string | string[];
  on_hand_by_stock: StockOnHandByStock[];
  total_on_hand: number;
  /** Array of length 1 — V2 returns single latest forecast with native v2 fields */
  latest_forecasts: StockLatestForecastV2[];
  open_alerts_count: number;
  recent_demand: StockRecentDemand | null;
  supply_breakdown: StockSupplyBreakdown;
  purchase_orders: StockPurchaseOrder[];
  inward_cadence?: StockInwardCadence;
  dus: number | null;
  status_band: "ok" | "reorder" | "critical" | null;
  projected_qty: number | null;
  generated_at: string;
}

/** @deprecated Use StockStatusResponseV2 — kept temporarily for any lingering callers */
export type StockStatusResponse = StockStatusResponseV2;

export interface StockStatusParams {
  branch_id?: string | string[];
  diagnostics?: boolean;
}

// ─── Cursor-paginated list types ──────────────────────────────────────────────

/** Generic cursor-pagination envelope returned by list endpoints. */
export interface CursorPage<T> {
  data: T[];
  next_cursor: string | null;
}

// ─── Stock list ───────────────────────────────────────────────────────────────

export type StockStatus = "ok" | "warn" | "critical";

/** Row returned by GET /api/v1/inventory/stock (list endpoint). */
export interface StockListItem {
  sku_code: string;
  name: string;
  branch_id: string;
  branch_name: string;
  on_hand: number;
  reserved: number;
  available: number;
  status: StockStatus;
  updated_at: string;
}

export interface StockListParams {
  q?: string;
  branch_id?: string;
  status?: StockStatus;
  /** Comma-separated stock_code list — filters SKUs to those with activity in these stocks,
   *  and switches on_hand/available/status to reflect the sum across selected stocks. */
  stock_codes?: string;
  limit?: number;
  cursor?: string;
  /** When true, include paused SKUs in results (default: excluded). */
  include_paused?: boolean;
}

/** Warehouse option for the stock filter dropdown (GET /api/v1/inventory/warehouses). */
export interface WarehouseOption {
  stock_code: string;
  stock_name: string | null;
}

// ─── Suppliers list ───────────────────────────────────────────────────────────

/** Row returned by GET /api/v1/inventory/suppliers */
export interface SupplierListItem {
  id: string;
  code: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  lead_time_p50_days: number | null;
  lead_time_p90_days: number | null;
  po_count_90d: number;
  last_po_date: string | null;
}

export interface SuppliersListParams {
  q?: string;
  branch_id?: string;
  limit?: number;
  cursor?: string;
}

// ─── Supplier detail ─────────────────────────────────────────────────────────

export type SupplierStatus = "active" | "paused";

export interface SupplierMetrics {
  sku_count_total: number;
  po_count_90d: number;
  revenue_90d: number;
  expected_need_30d: number;
}

export interface SupplierRiskCounts {
  ok: number;
  warn: number;
  critical: number;
}

/** Top-5 critical SKU row from supplier detail endpoint (V2 field: dus instead of forecast_30d) */
export interface SupplierTopCriticalSku {
  sku_code: string;
  name: string;
  on_hand: number;
  /** Days of supply — null when daily_rate=0. Sort ASC (lowest = most critical). */
  dus: number | null;
}

/** Full detail payload from GET /api/v1/inventory/suppliers/:id */
export interface SupplierDetail {
  id: string;
  code: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  lead_time_p50_days: number | null;
  lead_time_p90_days: number | null;
  /** User-declared vendor lead time, null if unset. Wins over measured values downstream. */
  lead_time_override_days: number | null;
  cadence_days: number | null;
  status: SupplierStatus;
  last_po_date: string | null;
  metrics: SupplierMetrics;
  risk_counts: SupplierRiskCounts;
  top_5_critical: SupplierTopCriticalSku[];
}

/** Response payload from PATCH /api/v1/inventory/suppliers/:id */
export interface SupplierUpdateResponse {
  account_object_id: string;
  account_object_code: string;
  lead_time_days: number;
  updated_at: string;
}

/** Row returned by GET /api/v2/inventory/suppliers/:id/skus */
export interface SupplierSkuItem {
  sku_code: string;
  name: string;
  branch_id: string;
  branch_name: string;
  on_hand: number;
  status: StockStatus;
  daily_rate: number | null;
  rop: number | null;
  safety_stock: number | null;
  classification: string | null;
  confidence: number | null;
  lead_time_p50_days: number | null;
  reorder_qty_suggestion: number | null;
  /** Days of supply — null when daily_rate=0/null */
  dus: number | null;
  updated_at: string;
}

/** @deprecated alias — same as SupplierSkuItem after V2 migration */
export type SupplierSkuItemV2 = SupplierSkuItem;

export interface SupplierSkusParams {
  q?: string;
  status?: string; // comma-separated StockStatus values
  limit?: number;
  cursor?: string;
}

// ─── Purchase Orders list ─────────────────────────────────────────────────────

/**
 * PO status strings returned by BE STATUS_LABELS:
 *   0 => "unknown", 1 => "not_started", 2 => "in_progress", 3 => "completed"
 * Using open string union to tolerate future additions without breaking.
 */
export type PurchaseOrderStatus =
  | "unknown"
  | "not_started"
  | "in_progress"
  | "completed"
  | (string & Record<never, never>); // tolerant fallback

/** Row returned by GET /api/v1/inventory/purchase-orders */
export interface PurchaseOrderListItem {
  id: string;
  po_no: string;
  created_at: string;
  supplier: { id: string; name: string };
  total_amount: string | number; // BE returns string ("10224000.0"), normalize at boundary
  currency: string;
  status: PurchaseOrderStatus;
  lines_count: number;
  expected_delivery_date: string | null;
}

export type PurchaseOrderSortField = "created_at" | "total_amount";
export type SortOrder = "asc" | "desc";

export interface PurchaseOrdersListParams {
  q?: string;
  branch_id?: string;
  status?: PurchaseOrderStatus;
  limit?: number;
  cursor?: string;
  sort?: PurchaseOrderSortField;
  order?: SortOrder;
}

export type AlertSeverity = "critical" | "high" | "medium" | "low";
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
  stock_code: string | null;
  branch_id: string;
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
}

export interface AlertListResponse {
  data: InventoryAlert[];
  meta: AlertListMeta;
}

export interface AlertListParams {
  severity?: AlertSeverity;
  alert_type?: string;
  status?: AlertStatus;
  branch_id?: string;
  item_code?: string;
  per_page?: number;
  page?: number;
}

export interface StockOnHandByStock {
  stock_code: string;
  stock_name?: string | null;
  qty: number;
}

export interface StockLatestForecast {
  horizon_days: number;
  forecast_date: string;
  qty_forecast: number;
  qty_lower: number | null;
  qty_upper: number | null;
  method: string;
  low_confidence: boolean;
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

export interface StockStatusResponse {
  item_code: string;
  branch_id: string | string[];
  on_hand_by_stock: StockOnHandByStock[];
  total_on_hand: number;
  latest_forecasts: StockLatestForecast[];
  open_alerts_count: number;
  recent_demand: StockRecentDemand | null;
  supply_breakdown: StockSupplyBreakdown;
  purchase_orders: StockPurchaseOrder[];
  inward_cadence?: StockInwardCadence;
  generated_at: string;
}

export interface StockStatusParams {
  branch_id?: string | string[];
  diagnostics?: boolean;
}

export interface ForecastPoint {
  id: string;
  item_code: string;
  stock_code: string | null;
  branch_id: string;
  forecast_date: string;
  horizon_days: number;
  qty_forecast: number;
  qty_lower: number | null;
  qty_upper: number | null;
  method: string;
  low_confidence: boolean;
  created_at: string;
}

export interface ForecastResponse {
  item_code: string;
  data: ForecastPoint[];
}

export interface ForecastParams {
  horizons?: Array<7 | 30 | 90>;
  branch_id?: string;
}

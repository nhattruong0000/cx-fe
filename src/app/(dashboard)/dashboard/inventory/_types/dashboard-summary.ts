// Types for GET /api/v2/inventory/dashboard-summary
// Contract defined in phase-02-api-contract-and-hook.md

export type AlertsByTypeItem = {
  type: string;
  label_vi: string;
  count: number;
};

export type StockHealth = {
  healthy: number;
  low: number;
  out: number;
  /** Items classified dormant/discontinued by InventorySkuLifecycle —
   *  long-inactive SKUs separated from the "Hết hàng" bucket. */
  dormant: number;
};

export type RiskSkuComponents = {
  doc: number | null;
  doc_below_threshold: boolean;
  forecast_exceeds_on_hand: boolean;
  open_alerts_count: number;
};

export type RiskySku = {
  code: string;
  name_vi: string;
  on_hand: number;
  days_of_cover: number | null;
  forecast_30d: number;
  open_alerts_count: number;
  risk_score: number;
  risk_components: RiskSkuComponents;
};

export type PoStatus = "upcoming" | "overdue";

export type UpcomingOrOverduePo = {
  po_id: string;
  po_number: string;
  supplier_name: string;
  /** ISO date string */
  eta: string;
  status: PoStatus;
  days_drift: number;
};

export type OffCadenceSupplier = {
  supplier_id: string;
  supplier_name: string;
  avg_gap_days: number;
  days_since_last_inward: number;
  overdue: boolean;
};

export type InventoryDashboardSummary = {
  /** ISO date string — server generation timestamp */
  generated_at: string;
  /** ISO date string — max(synced_at) across 5m-cadence AMIS sources; null if no data yet */
  last_amis_sync_at: string | null;
  /** Table names of AMIS sources used to derive last_amis_sync_at (for debug) */
  staleness_sources: string[];
  hero_kpis: {
    open_alerts_sku_count: number;
    critical_alerts_count: number;
    overdue_po_count: number;
    /** Percentage 0–100 — scoped to reorder-intent alert types only */
    reorder_needed_pct: number;
    /** Raw SKU count with open reorder-scope alert — for debug / sub-label */
    reorder_needed_skus_count: number;
  };
  breakdown: {
    alerts_by_type: AlertsByTypeItem[];
    stock_health: StockHealth;
  };
  top_lists: {
    /** Top 10 sorted desc by risk_score */
    risky_skus: RiskySku[];
    /** Top 10 sorted desc by |days_drift| */
    upcoming_or_overdue_pos: UpcomingOrOverduePo[];
    /** Top 10 — admin only; may be absent for non-admin roles */
    off_cadence_suppliers: OffCadenceSupplier[];
  };
};

export type DashboardSummaryParams = {
  branch_id?: string;
};

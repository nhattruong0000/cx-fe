/**
 * TypeScript types mirroring the EvidenceBundleSerializer whitelist.
 * Keys are snake_case to match BE response — no camelCase transform in this project.
 * Endpoint: GET /api/v1/inventory/items/:code/evidence
 */

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface EvidenceLifecycle {
  status: string | null;
  demand_pattern: string | null;
  active_weeks: number;
  zero_ratio: number | null;
}

export interface EvidenceOnHandByStock {
  stock_code: string;
  qty: number;
  stock_name?: string | null;
}

export interface EvidenceOnHand {
  total: number;
  by_stock: EvidenceOnHandByStock[];
  source: string;
  synced_at: string | null;
}

export interface EvidenceWeeklyHistoryBucket {
  week_start: string;
  qty_net: number;
  qty_inward: number;
}

export interface EvidenceForecast {
  horizon_days: number;
  qty_forecast: number | null;
  method: string;
  confidence: number | null;
  ci_low: number | null;
  ci_high: number | null;
}

export interface EvidenceLeadTimeVendor {
  vendor_code: string;
  p50: number | null;
  p90: number | null;
  sample: number;
}

export interface EvidenceLeadTimeEvent {
  vendor_code: string | null;
  receipt_date: string;
  lead_days: number;
  match_method: string;
}

export interface EvidenceLeadTimeProfile {
  p50: number | null;
  p90: number | null;
  sample: number;
  source: string;
  per_vendor: EvidenceLeadTimeVendor[];
  recent_events: EvidenceLeadTimeEvent[];
}

export interface EvidenceAlertSection {
  severity: string | null;
  dos: number | null;
  gate_reasons: string[];
  demand_daily: number | null;
}

export interface EvidenceSupplyBreakdown {
  on_hand: number;
  on_order_total: number;
  on_order_within_lead_time: number;
  effective_supply: number;
}

/** Single PO entry — whitelist: no vendor_name, no pricing */
export interface EvidencePurchaseOrder {
  pu_order_id: string;
  refdate: string | null;
  open_qty: number | null;
  eta_date: string | null;
  days_to_eta: number | null;
  is_overdue: boolean;
}

export interface EvidencePurchaseOrdersBundle {
  open_list: EvidencePurchaseOrder[];
  overdue_list: EvidencePurchaseOrder[];
  expediting_priority: EvidencePurchaseOrder[];
}

export type GateDecision = "accept" | "downgrade" | "drop" | "paused" | "needs_review";
export type BottleneckComponent = "confidence" | "lt_quality" | "on_hand";
export type ForecastStrategy = "manual" | "category_analog" | "blend" | "full";

export interface ReliabilityComponents {
  confidence: number;
  lt_quality: number;
  on_hand: number;
}

export interface EvidenceReliabilityScore {
  /** @deprecated use display_score */
  score: number;
  display_score: number;
  gate_score: number;
  bottleneck_component: BottleneckComponent | null;
  components: ReliabilityComponents;
  confidence: number;
  gate_decision: GateDecision | null;
  manual_review_required?: boolean;
  forecast_strategy?: ForecastStrategy;
  new_launch?: boolean;
  seasonal?: boolean;
  // Legacy fields — kept for backward compat during migration
  lt_quality?: string | null;
  oh_quality?: string | null;
}

export interface EvidenceItemInfo {
  item_name: string | null;
  category_code: string | null;
  category_name: string | null;
  vendor_code: string | null;
  vendor_name: string | null;
}

export interface EvidenceSuggestedPo {
  demand_daily: number | null;
  lead_p90: number;
  cover_days: number;
  qty_raw: number;
  qty_rounded: number;
  batch_size: number | null;
  vendor_code: string | null;
}

// ─── Root bundle ──────────────────────────────────────────────────────────────

export type InventoryStockStatus = "critical" | "warn" | "ok";

/** Full evidence bundle returned by GET /api/v1/inventory/items/:code/evidence */
export interface InventoryEvidenceBundle {
  item_code: string;
  generated_at: string;
  forecast_date: string;
  item_info: EvidenceItemInfo;
  lifecycle: EvidenceLifecycle;
  /**
   * Stock-level status computed from on_hand + minimum_stock.
   * Same rule as list page — keeps list and detail badges aligned.
   */
  stock_status: InventoryStockStatus;
  on_hand: EvidenceOnHand;
  weekly_history: EvidenceWeeklyHistoryBucket[];
  forecasts: EvidenceForecast[];
  lead_time: EvidenceLeadTimeProfile;
  alert: EvidenceAlertSection;
  supply_breakdown: EvidenceSupplyBreakdown;
  purchase_orders: EvidencePurchaseOrdersBundle;
  reliability: EvidenceReliabilityScore;
  suggested_po: EvidenceSuggestedPo;
}

// ─── Params ───────────────────────────────────────────────────────────────────

export interface EvidenceParams {
  branch_id?: string;
}

// Type definitions for /api/v2/aggregate-forecasts/* endpoints.
// BE source: cx-api/app/serializers/api/v2/aggregate_dashboard_serializer.rb +
// aggregate_forecast_serializer.rb

export type AggregationLevel = "total" | "category";
export type PeriodType = "weekly" | "monthly" | "quarterly";
export type ForecastMethod = "derived" | "independent";

export type ConsensusValues = {
  revenue: number;
  qty: number;
  cost: number;
};

// Sections returned by /dashboard endpoint
export type CashFlowProjectionRow = {
  period_start: string;
  revenue: number;
  cost: number;
  net_cashflow: number;
};

export type CashFlowSection = {
  projection: CashFlowProjectionRow[];
};

export type InventoryBudgetSection = {
  per_category: Record<string, Record<string, ConsensusValues>>; // category_id -> { period_start -> values }
  total: Record<string, ConsensusValues>;
};

export type KpiReportSection = {
  forecast_vs_target: { available: boolean; reason?: string };
};

export type TrendCategoryEntry = {
  period_start: string;
  qty: number;
  revenue: number;
};

export type TrendAnalysisSection = {
  per_category_timeseries: Record<string, Record<PeriodType, TrendCategoryEntry[]>>;
};

export type ForecastHealthSection = {
  coverage: number;
  method_disagreement: number;
};

export type AggregateDashboardResponse = {
  generated_at: string;
  as_of: string;
  sections: {
    cash_flow: CashFlowSection;
    inventory_budget: InventoryBudgetSection;
    kpi_report: KpiReportSection;
    trend_analysis: TrendAnalysisSection;
    forecast_health: ForecastHealthSection;
  };
};

// Accuracy endpoint
export type AccuracyMetric = "revenue" | "qty" | "cost";

export type AccuracyRow = {
  aggregation_level: AggregationLevel;
  period_type: PeriodType;
  forecast_method: ForecastMethod;
  metric: AccuracyMetric;
  sample_count: number;
  wmape: number | null;
  bias: number | null;
  flag: string | null;
};

export type AccuracyResponse = {
  generated_at: string;
  window_days: number;
  data: AccuracyRow[];
};

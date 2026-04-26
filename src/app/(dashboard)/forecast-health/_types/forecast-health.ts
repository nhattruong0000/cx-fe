// Type definitions for /api/v2/inventory/forecast-health response.
// BE source: cx-api/app/controllers/api/v2/inventory/forecast_health_controller.rb

export type ForecastHealthRow = {
  item_code: string;
  stock_code: string;
  branch_id: string;
  n: number;
  wmape: number | null;
  bias: number | null;
  confidence: number | null;
};

export type ForecastHealthCounts = {
  total: number;
  with_confidence: number;
  insufficient_data: number;
  flagged_high_wmape: number;
};

export type ForecastHealthResponse = {
  generated_at: string;
  scope: { branch_ids: string[] };
  counts: ForecastHealthCounts;
  data: ForecastHealthRow[];
};

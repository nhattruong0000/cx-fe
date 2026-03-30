export interface AnalyticsKPIs {
  nps_score: number;
  nps_trend: number;
  csat_average: number;
  csat_trend: number;
  response_rate: number;
  response_rate_trend: number;
  total_requests: number;
  avg_resolution_days: number;
  resolution_trend: number;
  completion_rate: number;
}

export interface AnalyticsCharts {
  nps_trend: { month: string; score: number }[];
  csat_by_org: { org_name: string; avg: number }[];
  support_status: { status: string; count: number }[];
  response_rate: { week: string; rate: number }[];
}

export interface AnalyticsOverview {
  kpis: AnalyticsKPIs;
  charts: AnalyticsCharts;
}

export interface DashboardSummary {
  surveys: { active: number; responses: number };
  support: { pending: number; today: number };
  analytics: { nps: number; csat: number };
  users: { total: number; groups: number };
}

export interface CustomerDashboard {
  surveys: { pending_count: number };
  support: { active_count: number };
  recent_activities: { action: string; description: string; created_at: string }[];
}

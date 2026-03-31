export type UserRole = "admin" | "staff" | "customer";

// Shared stat shape
export interface StatItem {
  label: string;
  value: string | number;
  change: number; // percentage, e.g. 12 = +12%
  changeLabel: string; // "vs last month"
  icon: string; // lucide icon name
}

// Chart data point
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number; // additional series
}

// Activity feed item
export interface ActivityItem {
  id: string;
  user_name: string;
  user_initials: string;
  action: string;
  timestamp: string; // ISO date
}

// Role distribution for donut chart
export interface RoleDistribution {
  role: string;
  count: number;
}

// Survey/ticket row
export interface SurveyRow {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

// Team member (customer dashboard)
export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  initials: string;
}

// Organization info (customer dashboard)
export interface OrganizationInfo {
  name: string;
  role: string;
  members_count: number;
  plan: string;
}

// --- Discriminated union responses ---

export interface AdminDashboardSummary {
  role: "admin";
  stats: StatItem[];
  survey_responses_chart: ChartDataPoint[];
  tickets_by_category_chart: ChartDataPoint[];
  role_distribution: RoleDistribution[];
  recent_activity: ActivityItem[];
}

export interface StaffDashboardSummary {
  role: "staff";
  stats: StatItem[];
  response_trends_chart: ChartDataPoint[];
  tickets_by_status_chart: ChartDataPoint[];
  surveys: SurveyRow[];
  tickets: SurveyRow[];
}

export interface CustomerDashboardSummary {
  role: "customer";
  user_name: string;
  organization: OrganizationInfo;
  team_members: TeamMember[];
  stats: StatItem[];
  surveys: SurveyRow[];
}

export type DashboardSummary =
  | AdminDashboardSummary
  | StaffDashboardSummary
  | CustomerDashboardSummary;

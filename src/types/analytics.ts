export interface DashboardStats {
  npsScore: number;
  csatAverage: number;
  responseRate: number;
  avgResolutionTime: number;
  chatVolume: number;
  loyaltyEngagement: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export type Tier = "bronze" | "silver" | "gold";

export type TransactionType = "earn" | "redeem";

export interface LoyaltyBalance {
  userId: string;
  customerName: string;
  points: number;
  tier: Tier;
  lifetimePoints: number;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  points: number;
  source: string;
  createdAt: string;
}

export interface TierDistribution {
  tier: Tier;
  count: number;
  percentage: number;
}

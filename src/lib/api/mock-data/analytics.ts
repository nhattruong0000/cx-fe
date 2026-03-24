import type { ChartDataPoint, DashboardStats, LoyaltyBalance, TierDistribution } from "@/types/analytics";

export const mockDashboardStats: DashboardStats = {
  npsScore: 42,
  csatAverage: 4.3,
  responseRate: 68.5,
  avgResolutionTime: 2.4,
  chatVolume: 156,
  loyaltyEngagement: 73.2,
};

export const mockNpsTrend: ChartDataPoint[] = [
  { date: "2026-01-01", value: 35, label: "Tháng 1" },
  { date: "2026-01-15", value: 38, label: "Tháng 1" },
  { date: "2026-02-01", value: 40, label: "Tháng 2" },
  { date: "2026-02-15", value: 37, label: "Tháng 2" },
  { date: "2026-03-01", value: 42, label: "Tháng 3" },
  { date: "2026-03-15", value: 45, label: "Tháng 3" },
];

export const mockCsatTrend: ChartDataPoint[] = [
  { date: "2026-01-01", value: 4.0, label: "Tháng 1" },
  { date: "2026-01-15", value: 4.1, label: "Tháng 1" },
  { date: "2026-02-01", value: 4.2, label: "Tháng 2" },
  { date: "2026-02-15", value: 4.1, label: "Tháng 2" },
  { date: "2026-03-01", value: 4.3, label: "Tháng 3" },
  { date: "2026-03-15", value: 4.4, label: "Tháng 3" },
];

export const mockChatVolumeTrend: ChartDataPoint[] = [
  { date: "2026-03-18", value: 28, label: "Thứ 2" },
  { date: "2026-03-19", value: 35, label: "Thứ 3" },
  { date: "2026-03-20", value: 22, label: "Thứ 4" },
  { date: "2026-03-21", value: 31, label: "Thứ 5" },
  { date: "2026-03-22", value: 18, label: "Thứ 6" },
  { date: "2026-03-23", value: 12, label: "Thứ 7" },
  { date: "2026-03-24", value: 10, label: "CN" },
];

export const mockLoyaltyBalances: LoyaltyBalance[] = [
  { userId: "usr-101", customerName: "Nguyễn Văn An", points: 2450, tier: "gold", lifetimePoints: 15200 },
  { userId: "usr-102", customerName: "Trần Thị Bình", points: 1200, tier: "silver", lifetimePoints: 8500 },
  { userId: "usr-103", customerName: "Lê Minh Châu", points: 350, tier: "bronze", lifetimePoints: 2100 },
  { userId: "usr-104", customerName: "Phạm Đức Dũng", points: 3100, tier: "gold", lifetimePoints: 22000 },
  { userId: "usr-105", customerName: "Hoàng Thị Em", points: 890, tier: "silver", lifetimePoints: 5600 },
  { userId: "usr-106", customerName: "Võ Văn Phúc", points: 150, tier: "bronze", lifetimePoints: 900 },
  { userId: "usr-107", customerName: "Đỗ Thị Giang", points: 1800, tier: "silver", lifetimePoints: 11000 },
  { userId: "usr-108", customerName: "Bùi Hữu Hải", points: 4200, tier: "gold", lifetimePoints: 28500 },
  { userId: "usr-109", customerName: "Ngô Thị Inh", points: 500, tier: "bronze", lifetimePoints: 3200 },
  { userId: "usr-110", customerName: "Lý Văn Khánh", points: 2100, tier: "gold", lifetimePoints: 17800 },
];

export const mockTierDistribution: TierDistribution[] = [
  { tier: "bronze", count: 1250, percentage: 50 },
  { tier: "silver", count: 875, percentage: 35 },
  { tier: "gold", count: 375, percentage: 15 },
];

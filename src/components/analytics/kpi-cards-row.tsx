"use client";

import type { DashboardStats } from "@/types/analytics";
import { KpiStatCard } from "./kpi-stat-card";

interface KpiCardsRowProps {
  stats: DashboardStats;
}

export function KpiCardsRow({ stats }: KpiCardsRowProps) {
  const cards = [
    { label: "Điểm NPS", value: stats.npsScore, change: 5.2 },
    { label: "CSAT trung bình", value: stats.csatAverage, suffix: "/5", change: 2.1 },
    { label: "Tỷ lệ phản hồi", value: `${stats.responseRate}%`, change: 3.8 },
    { label: "Thời gian xử lý TB", value: `${stats.avgResolutionTime}h`, change: -8.5 },
    { label: "Lượng chat", value: stats.chatVolume, change: 12.3 },
    { label: "Loyalty tương tác", value: `${stats.loyaltyEngagement}%`, change: 1.5 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <KpiStatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

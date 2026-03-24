"use client";

import type { JourneyStats } from "@/types/journey";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface JourneyStatsCardsProps {
  stats: JourneyStats;
}

export function JourneyStatsCards({ stats }: JourneyStatsCardsProps) {
  const cards = [
    { label: "Tổng sự kiện", value: formatNumber(stats.totalEvents) },
    { label: "Khách hàng unique", value: formatNumber(stats.uniqueCustomers) },
    { label: "TB sự kiện/khách", value: stats.avgEventsPerCustomer.toFixed(1) },
    { label: "Tỷ lệ chuyển đổi", value: `${stats.conversionRate}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

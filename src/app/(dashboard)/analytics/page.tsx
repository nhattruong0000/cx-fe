"use client";

import { useState } from "react";
import { subDays } from "date-fns";
import type { DateRange } from "@/types/common";
import { QueryBoundary } from "@/components/query-boundary";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { KpiCardsRow } from "@/components/analytics/kpi-cards-row";
import { NpsTrendChart } from "@/components/analytics/nps-trend-chart";
import { CsatBreakdownChart } from "@/components/analytics/csat-breakdown-chart";
import { ResponseRateChart } from "@/components/analytics/response-rate-chart";
import { LoyaltyStatsSection } from "@/components/analytics/loyalty-stats-section";
import {
  useDashboardStats,
  useNpsTrend,
  useCsatBreakdown,
  useResponseRate,
  useLoyaltyStats,
  useTierDistribution,
} from "@/hooks/use-analytics";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const statsQuery = useDashboardStats(dateRange);
  const npsQuery = useNpsTrend(dateRange);
  const csatQuery = useCsatBreakdown(dateRange);
  const responseQuery = useResponseRate(dateRange);
  const loyaltyQuery = useLoyaltyStats(dateRange);
  const tierQuery = useTierDistribution(dateRange);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Phân tích</h1>
          <p className="text-sm text-muted-foreground">Tổng quan hiệu suất trải nghiệm khách hàng</p>
        </div>
        <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
      </div>

      <QueryBoundary isLoading={statsQuery.isLoading} isError={statsQuery.isError} error={statsQuery.error}>
        {statsQuery.data && <KpiCardsRow stats={statsQuery.data} />}
      </QueryBoundary>

      <div className="grid gap-6 lg:grid-cols-2">
        <NpsTrendChart data={npsQuery.data ?? []} isLoading={npsQuery.isLoading} />
        <CsatBreakdownChart data={csatQuery.data ?? []} isLoading={csatQuery.isLoading} />
      </div>

      <ResponseRateChart data={responseQuery.data ?? []} isLoading={responseQuery.isLoading} />

      <QueryBoundary isLoading={loyaltyQuery.isLoading || tierQuery.isLoading} isError={loyaltyQuery.isError} error={loyaltyQuery.error}>
        {loyaltyQuery.data && tierQuery.data && (
          <LoyaltyStatsSection
            totalMembers={loyaltyQuery.data.totalMembers}
            pointsIssued={loyaltyQuery.data.pointsIssued}
            pointsRedeemed={loyaltyQuery.data.pointsRedeemed}
            tierDistribution={tierQuery.data}
          />
        )}
      </QueryBoundary>
    </div>
  );
}

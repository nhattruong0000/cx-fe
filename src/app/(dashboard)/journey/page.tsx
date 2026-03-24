"use client";

import { QueryBoundary } from "@/components/query-boundary";
import { JourneyFunnel } from "@/components/journey/journey-funnel";
import { JourneyStatsCards } from "@/components/journey/journey-stats-cards";
import { useJourneyFunnel, useJourneyStats } from "@/hooks/use-analytics";

export default function JourneyPage() {
  const funnelQuery = useJourneyFunnel();
  const statsQuery = useJourneyStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hành trình khách hàng</h1>
        <p className="text-sm text-muted-foreground">Phễu chuyển đổi và thống kê hành trình</p>
      </div>

      <QueryBoundary isLoading={statsQuery.isLoading} isError={statsQuery.isError} error={statsQuery.error}>
        {statsQuery.data && <JourneyStatsCards stats={statsQuery.data} />}
      </QueryBoundary>

      <QueryBoundary isLoading={funnelQuery.isLoading} isError={funnelQuery.isError} error={funnelQuery.error}>
        {funnelQuery.data && <JourneyFunnel stages={funnelQuery.data} />}
      </QueryBoundary>
    </div>
  );
}

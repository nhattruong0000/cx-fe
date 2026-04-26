"use client";

import type { KpiReportSection } from "../_types/aggregate-forecast";

export function AggregateTabKpiReport({ section }: { section: KpiReportSection }) {
  const target = section.forecast_vs_target;
  return (
    <div className="rounded-[14px] border border-border bg-card p-12 text-center">
      <h3 className="mb-2 text-base font-semibold text-foreground">KPI vs Target</h3>
      {!target.available ? (
        <p className="text-sm text-muted-foreground">
          {target.reason ?? "Tính năng KPI targets sẽ available Phase 2."}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">KPI data available — coming soon.</p>
      )}
    </div>
  );
}

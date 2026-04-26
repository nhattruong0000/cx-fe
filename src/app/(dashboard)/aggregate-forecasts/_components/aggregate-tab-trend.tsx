"use client";

import type { TrendAnalysisSection, PeriodType } from "../_types/aggregate-forecast";

const fmtVnd = (v: number): string =>
  v.toLocaleString("vi-VN", { maximumFractionDigits: 0 });

const PERIOD_LABEL: Record<PeriodType, string> = {
  weekly: "Tuần",
  monthly: "Tháng",
  quarterly: "Quý",
};

export function AggregateTabTrend({ section }: { section: TrendAnalysisSection }) {
  const cats = Object.entries(section.per_category_timeseries ?? {});
  if (cats.length === 0) {
    return (
      <div className="rounded-[14px] border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        Chưa có dữ liệu trend.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {cats.slice(0, 8).map(([catId, byPeriod]) => (
        <div
          key={catId}
          className="rounded-[14px] border border-border bg-card p-4"
        >
          <h3 className="mb-2 font-mono text-xs text-muted-foreground">{catId.slice(0, 8)}…</h3>
          <div className="flex flex-col gap-3">
            {(Object.entries(byPeriod) as [PeriodType, Array<{period_start: string; qty: number; revenue: number}>][]).map(([periodType, entries]) => (
              <div key={periodType}>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {PERIOD_LABEL[periodType]}
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {entries.slice(0, 4).map((e) => (
                    <div
                      key={`${periodType}-${e.period_start}`}
                      className="rounded-md bg-muted px-2 py-1 text-xs"
                    >
                      <span className="text-muted-foreground">
                        {new Date(e.period_start).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="ml-1 font-semibold text-foreground">{fmtVnd(e.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

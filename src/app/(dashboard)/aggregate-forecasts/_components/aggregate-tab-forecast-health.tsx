"use client";

import { useAggregateAccuracy } from "../_hooks/use-aggregate-dashboard";
import type {
  ForecastHealthSection,
  AccuracyRow,
} from "../_types/aggregate-forecast";

const fmtPct = (v: number | null): string =>
  v === null ? "—" : `${(v * 100).toFixed(1)}%`;

function wmapeColor(w: number | null): string {
  if (w === null) return "text-muted-foreground";
  if (w < 0.3) return "text-[#16A34A]";
  if (w < 0.5) return "text-[#F59E0B]";
  return "text-[#DC2626] font-semibold";
}

export function AggregateTabForecastHealth({ section }: { section: ForecastHealthSection }) {
  const { data: accuracy, isLoading } = useAggregateAccuracy();
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <KpiCard
          label="Total coverage"
          value={String(section.coverage ?? 0)}
          helper="Aggregate forecasts loaded"
        />
        <KpiCard
          label="Method disagreement (major)"
          value={String(section.method_disagreement ?? 0)}
          helper="Cross-check status = major_divergence"
          accent={section.method_disagreement > 0 ? "border-t-4 border-t-[#DC2626]" : ""}
        />
      </div>
      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-primary-light">
            <tr>
              <Th>Level</Th>
              <Th>Period</Th>
              <Th>Method</Th>
              <Th>Metric</Th>
              <Th align="right">Samples</Th>
              <Th align="right">WMAPE</Th>
              <Th align="right">Bias</Th>
              <Th>Flag</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Đang tải dữ liệu accuracy...
                </td>
              </tr>
            )}
            {!isLoading && (accuracy?.data ?? []).length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Chưa có dữ liệu accuracy. Backtest chưa chạy nightly.
                </td>
              </tr>
            )}
            {(accuracy?.data ?? []).map((row: AccuracyRow, i: number) => (
              <tr
                key={`${row.aggregation_level}-${row.period_type}-${row.forecast_method}-${row.metric}-${i}`}
                className="border-t border-border"
              >
                <td className="px-4 py-3 text-foreground">{row.aggregation_level}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.period_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.forecast_method}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.metric}</td>
                <td className="px-4 py-3 text-right">{row.sample_count}</td>
                <td className={`px-4 py-3 text-right ${wmapeColor(row.wmape)}`}>
                  {fmtPct(row.wmape)}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">{fmtPct(row.bias)}</td>
                <td className="px-4 py-3">
                  {row.flag ? (
                    <span className="rounded-full bg-[#FEF2F2] px-2 py-0.5 text-xs text-[#DC2626]">
                      {row.flag}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  helper,
  accent = "",
}: {
  label: string;
  value: string;
  helper: string;
  accent?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-[14px] border border-border bg-card p-5 ${accent}`}
    >
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-3xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{helper}</span>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 ${align === "right" ? "text-right" : "text-left"} text-xs font-semibold uppercase tracking-wider text-muted-foreground`}
    >
      {children}
    </th>
  );
}

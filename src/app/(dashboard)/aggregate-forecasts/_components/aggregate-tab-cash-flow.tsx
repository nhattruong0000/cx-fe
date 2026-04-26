"use client";

import type { CashFlowSection } from "../_types/aggregate-forecast";

const fmtVnd = (v: number): string =>
  v.toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export function AggregateTabCashFlow({ section }: { section: CashFlowSection }) {
  const rows = section.projection ?? [];
  if (rows.length === 0) {
    return (
      <div className="rounded-[14px] border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        Chưa có forecast cash flow. Daily aggregate job sẽ generate sau 04:00.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <SummaryCard
          label="Tổng revenue projection"
          value={fmtVnd(rows.reduce((s, r) => s + r.revenue, 0))}
          unit="đ"
          accent="border-t-4 border-t-primary"
        />
        <SummaryCard
          label="Tổng cost projection"
          value={fmtVnd(rows.reduce((s, r) => s + r.cost, 0))}
          unit="đ"
          accent="border-t-4 border-t-[#F59E0B]"
        />
        <SummaryCard
          label="Net cashflow"
          value={fmtVnd(rows.reduce((s, r) => s + r.net_cashflow, 0))}
          unit="đ"
          accent="border-t-4 border-t-[#16A34A]"
        />
      </div>
      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-primary-light">
            <tr>
              <Th>Period start</Th>
              <Th align="right">Revenue</Th>
              <Th align="right">Cost</Th>
              <Th align="right">Net cashflow</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.period_start} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                  {new Date(r.period_start).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-right">{fmtVnd(r.revenue)} đ</td>
                <td className="px-4 py-3 text-right">{fmtVnd(r.cost)} đ</td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${r.net_cashflow >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}`}
                >
                  {fmtVnd(r.net_cashflow)} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent: string;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-[14px] border border-border bg-card p-5 ${accent}`}
    >
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-2xl font-bold text-foreground">
        {value} <span className="text-base font-normal text-muted-foreground">{unit}</span>
      </span>
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

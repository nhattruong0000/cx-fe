"use client";

import type { ForecastHealthRow } from "../_types/forecast-health";

type Props = {
  rows: ForecastHealthRow[];
  isLoading: boolean;
};

const HEADERS = ["SKU", "Stock", "n datapoints", "WMAPE", "Bias", "Confidence"];

function wmapeColor(w: number | null): string {
  if (w === null) return "text-muted-foreground";
  if (w < 0.3) return "text-[#16A34A]";
  if (w < 0.5) return "text-[#F59E0B]";
  return "text-[#DC2626] font-semibold";
}

function biasColor(b: number | null): string {
  if (b === null) return "text-muted-foreground";
  if (Math.abs(b) < 0.1) return "text-foreground";
  if (Math.abs(b) < 0.2) return "text-[#F59E0B]";
  return "text-[#DC2626]";
}

function fmtPct(v: number | null): string {
  if (v === null) return "—";
  return `${(v * 100).toFixed(1)}%`;
}

function fmtConf(v: number | null): string {
  if (v === null) return "NULL";
  return v.toFixed(2);
}

export function ForecastHealthTable({ rows, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-[14px] border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        Đang tải dữ liệu...
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="rounded-[14px] border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        Chưa có dữ liệu forecast accuracy. Backtest jobs đang accumulate data — quay lại sau 4 tuần.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-primary-light">
          <tr>
            {HEADERS.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={`${row.item_code}-${row.stock_code}-${i}`}
              className="border-t border-border hover:bg-muted/50"
            >
              <td className="px-4 py-3 font-medium text-foreground">{row.item_code}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.stock_code}</td>
              <td className="px-4 py-3 text-foreground">{row.n}</td>
              <td className={`px-4 py-3 ${wmapeColor(row.wmape)}`}>{fmtPct(row.wmape)}</td>
              <td className={`px-4 py-3 ${biasColor(row.bias)}`}>
                {row.bias === null ? "—" : (row.bias > 0 ? "+" : "") + fmtPct(row.bias)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{fmtConf(row.confidence)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

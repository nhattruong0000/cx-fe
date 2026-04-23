"use client";

/**
 * Weekly History Chart — grouped bar chart showing weekly sell-out and inbound qty.
 * Renders up to 12 weeks from the evidence bundle's weekly_history data.
 *
 * NOTE: Recharts SVG attributes cannot use CSS custom properties directly.
 * We resolve design token colors at render time via getComputedStyle so the chart
 * respects light/dark theme without hardcoded hex literals.
 */

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EvidenceWeeklyHistoryBucket } from "@/types/inventory-evidence";

interface WeeklyHistoryChartProps {
  data: EvidenceWeeklyHistoryBucket[];
}

/** Resolve a CSS custom property from :root at runtime (SSR-safe: returns fallback). */
function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw ? `hsl(${raw})` : fallback;
}

/** Format ISO week start date to Vietnamese short format: "12/3" */
function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function WeeklyHistoryChart({ data }: WeeklyHistoryChartProps) {
  // Show last 12 weeks max
  const displayData = data.slice(-12).map((b) => ({
    week: formatWeekLabel(b.week_start),
    "Lượng bán": b.qty_net,
    "Lượng nhập": b.qty_inward,
  }));

  // Resolve design tokens once per render — Recharts needs concrete color strings
  const colors = useMemo(
    () => ({
      border: cssVar("--border", "hsl(240 5.9% 90%)"),
      mutedFg: cssVar("--muted-foreground", "hsl(240 3.8% 46.1%)"),
      primary: cssVar("--primary", "hsl(220 67% 46%)"),
      info: cssVar("--info", "hsl(220 67% 46%)"),
    }),
    [],
  );

  if (displayData.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Chưa có dữ liệu lịch sử bán hàng.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={displayData}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
        aria-label="Biểu đồ lịch sử bán và nhập hàng theo tuần"
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: colors.mutedFg }} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: colors.mutedFg }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${colors.border}` }}
          formatter={(value, name) => [Number(value).toLocaleString("vi-VN"), String(name)]}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        {/* Primary bar = primary token; secondary bar uses info/50 opacity via opacity prop */}
        <Bar dataKey="Lượng bán" fill={colors.primary} radius={[3, 3, 0, 0]} maxBarSize={20} />
        <Bar dataKey="Lượng nhập" fill={colors.info} opacity={0.4} radius={[3, 3, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

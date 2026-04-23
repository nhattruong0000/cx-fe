"use client";

// Stacked proportion bar showing stock health distribution (healthy / low / out).
// Design ref: .pen frames K26fm/rCNXg — expects a horizontal stacked 100% bar with
// 3 color segments and inline % labels, NOT an axis-scaled column chart.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";

// Semantic color classes — maps to design system tokens from globals.css.
// healthy → success token (green), low → warning (amber), out → destructive (red).
const HEALTH_SEGMENTS = [
  { key: "healthy" as const, label: "Khỏe mạnh", colorClass: "bg-success" },
  { key: "low" as const,     label: "Tồn thấp",   colorClass: "bg-warning" },
  { key: "out" as const,     label: "Hết hàng",   colorClass: "bg-destructive" },
];

/** Format a proportion 0–1 as a percentage string with 1 decimal if < 10% */
function fmtPct(ratio: number): string {
  const pct = ratio * 100;
  if (pct === 0) return "0%";
  if (pct < 1) return "<1%";
  return `${Math.round(pct)}%`;
}

export function StockHealthBar() {
  const { data, isLoading, isError } = useInventoryDashboardSummary();
  const health = data?.breakdown.stock_health;

  const total = health ? health.healthy + health.low + health.out : 0;

  // Compute proportions — guard against total=0 to avoid division by zero.
  const segments =
    health && total > 0
      ? HEALTH_SEGMENTS.map((seg) => ({
          ...seg,
          count: health[seg.key],
          ratio: health[seg.key] / total,
        }))
      : [];

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Phân bố sức khỏe tồn kho
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="h-[80px] animate-pulse rounded bg-muted" />
        )}
        {!isLoading && isError && (
          <p className="py-6 text-xs text-destructive">Không tải được dữ liệu.</p>
        )}
        {!isLoading && !isError && segments.length > 0 && (
          <div className="space-y-3">
            {/* Stacked horizontal bar — flexbox proportional widths */}
            <div
              className="flex h-6 w-full overflow-hidden rounded-full"
              role="img"
              aria-label="Biểu đồ phân bố sức khỏe tồn kho"
            >
              {segments
                .filter((s) => s.ratio > 0)
                .map((seg) => (
                  <div
                    key={seg.key}
                    className={`${seg.colorClass} transition-all`}
                    style={{ width: `${(seg.ratio * 100).toFixed(2)}%` }}
                    title={`${seg.label}: ${fmtPct(seg.ratio)} (${seg.count.toLocaleString("vi-VN")} SKU)`}
                  />
                ))}
            </div>

            {/* Legend row with count + pct per segment */}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {segments.map((seg) => (
                <div key={seg.key} className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`inline-block h-2.5 w-2.5 shrink-0 rounded-sm ${seg.colorClass}`}
                  />
                  <span className="text-muted-foreground">{seg.label}</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {fmtPct(seg.ratio)}
                  </span>
                  <span className="text-muted-foreground">
                    ({seg.count.toLocaleString("vi-VN")})
                  </span>
                </div>
              ))}
            </div>

            {/* Total SKU count footnote */}
            <p className="text-[11px] text-muted-foreground">
              Tổng: {total.toLocaleString("vi-VN")} SKU
            </p>
          </div>
        )}
        {!isLoading && !isError && segments.length === 0 && (
          <p className="py-6 text-xs text-muted-foreground">Không có dữ liệu.</p>
        )}
      </CardContent>
    </Card>
  );
}

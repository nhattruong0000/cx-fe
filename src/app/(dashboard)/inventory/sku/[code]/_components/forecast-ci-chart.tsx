"use client";

/**
 * Forecast CI Chart — 3 horizon cards (7/30/90 days) showing forecast qty with CI range.
 * 30-day card is visually highlighted as primary.
 */

import { Badge } from "@/components/ui/badge";
import type { EvidenceForecast } from "@/types/inventory-evidence";

interface ForecastCiChartProps {
  forecasts: EvidenceForecast[];
}

const HORIZON_CONFIG: Record<number, { label: string; sublabel: string; isPrimary: boolean }> = {
  7: { label: "7 ngày", sublabel: "Ngắn hạn", isPrimary: false },
  30: { label: "30 ngày", sublabel: "Trung hạn", isPrimary: true },
  90: { label: "90 ngày", sublabel: "Dài hạn", isPrimary: false },
};

/** Small horizontal bar indicator showing CI low/high relative to forecast qty */
function CiBar({ low, forecast, high }: { low: number; forecast: number; high: number }) {
  const min = Math.min(low, 0);
  const max = Math.max(high, forecast);
  const range = max - min || 1;
  const lowPct = ((low - min) / range) * 100;
  const forecastPct = ((forecast - min) / range) * 100;
  const highPct = ((high - min) / range) * 100;

  return (
    <div className="relative h-2 w-full rounded-full bg-muted">
      {/* CI band — use info/20 token instead of non-token blue-100 */}
      <div
        className="absolute inset-y-0 rounded-full bg-info/20"
        style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
      />
      {/* Forecast dot */}
      <div
        className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${forecastPct}%` }}
      />
    </div>
  );
}

export function ForecastCiChart({ forecasts }: ForecastCiChartProps) {
  const horizons = [7, 30, 90];

  return (
    <div className="flex flex-col gap-3" aria-label="Dự báo theo khoảng thời gian">
      {horizons.map((h) => {
        const f = forecasts.find((x) => x.horizon_days === h);
        const cfg = HORIZON_CONFIG[h];

        if (!f) {
          return (
            <div
              key={h}
              className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground"
            >
              Chưa có dự báo {cfg.label}
            </div>
          );
        }

        const hasQty = f.qty_forecast !== null && f.qty_forecast !== undefined;
        const hasCi = hasQty && f.ci_low !== null && f.ci_high !== null;

        return (
          <div
            key={h}
            className={
              cfg.isPrimary
                ? "rounded-lg border-2 border-primary bg-primary/5 p-3"
                : "rounded-lg border border-border bg-card p-3"
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{cfg.sublabel} · {cfg.label}</p>
                <p className="mt-0.5 text-2xl font-bold text-foreground">
                  {f.qty_forecast?.toLocaleString("vi-VN") ?? "—"}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">sp</span>
                </p>
                {hasCi && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Dao động: {f.ci_low!.toLocaleString("vi-VN")} — {f.ci_high!.toLocaleString("vi-VN")}
                  </p>
                )}
              </div>
              {f.confidence !== null && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {Math.round(f.confidence * 100)}%
                </Badge>
              )}
            </div>
            {hasCi && (
              <div className="mt-2">
                <CiBar
                  low={f.ci_low!}
                  forecast={f.qty_forecast!}
                  high={f.ci_high!}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

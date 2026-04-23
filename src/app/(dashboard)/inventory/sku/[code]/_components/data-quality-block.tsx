"use client";

/**
 * DataQualityBlock — secondary signal card for data quality score.
 * Shows display_score gauge, bottleneck highlight, and 3-component breakdown.
 * Intentionally secondary to DecisionBlock — score is context, not the verdict.
 */

import { HelpTooltip } from "@/components/ui/help-tooltip";
import type { BottleneckComponent, ReliabilityComponents } from "@/types/inventory-evidence";

// ─── Config ───────────────────────────────────────────────────────────────────

const COMPONENT_LABEL: Record<BottleneckComponent | string, string> = {
  confidence: "Độ tin cậy mô hình dự báo",
  lt_quality: "Chất lượng dữ liệu giao hàng",
  on_hand:    "Dữ liệu tồn kho",
};

/** Score zone thresholds (display_score is 0–1). */
function scoreZone(pct: number): { label: string; tone: "success" | "warning" | "destructive" } {
  if (pct >= 70) return { label: "Đạt", tone: "success" };
  if (pct >= 50) return { label: "Giảm cấp", tone: "warning" };
  return { label: "Thấp", tone: "destructive" };
}

const TONE_TEXT: Record<"success" | "warning" | "destructive", string> = {
  success:     "text-success",
  warning:     "text-warning",
  destructive: "text-destructive",
};

const TONE_BG_LIGHT: Record<"success" | "warning" | "destructive", string> = {
  success:     "bg-success/10",
  warning:     "bg-warning/10",
  destructive: "bg-destructive/10",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataQualityBlockProps {
  displayScore: number;
  bottleneck: BottleneckComponent | null;
  components: ReliabilityComponents;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toPct(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataQualityBlock({ displayScore, bottleneck, components }: DataQualityBlockProps) {
  const scorePct = Math.round(displayScore * 100);
  const zone = scoreZone(scorePct);

  const componentRows: Array<{ key: BottleneckComponent; value: number }> = [
    { key: "confidence", value: components.confidence },
    { key: "lt_quality",  value: components.lt_quality },
    { key: "on_hand",     value: components.on_hand },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Điểm chất lượng dữ liệu
        </p>
        <HelpTooltip>
          <p className="text-xs">
            <strong>0.5 × Độ tin cậy</strong> + <strong>0.3 × Giao hàng</strong> + <strong>0.2 × Tồn kho</strong>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Điểm này đo chất lượng dữ liệu đầu vào. Quyết định dự báo ở trên là tín hiệu chính xác hơn.
          </p>
        </HelpTooltip>
      </div>

      {/* Score display */}
      <div className="flex items-end gap-2">
        <span className={`text-4xl font-bold ${TONE_TEXT[zone.tone]}`}>{scorePct}</span>
        <span className="mb-1 text-lg text-muted-foreground">/100</span>
        <span
          className={`mb-1 ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${TONE_TEXT[zone.tone]} ${TONE_BG_LIGHT[zone.tone]}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {zone.label}
        </span>
      </div>

      {/* 3-zone bar */}
      <div>
        <div className="relative mb-1 flex h-3 w-full overflow-hidden rounded-full">
          <div className="h-full w-[50%] bg-destructive/70" />
          <div className="h-full w-[20%] bg-warning" />
          <div className="h-full flex-1 bg-success" />
          <div
            className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-foreground"
            style={{ left: `${Math.min(Math.max(scorePct, 0), 100)}%` }}
            aria-label={`Điểm hiện tại: ${scorePct}/100`}
          />
        </div>
        <div className="relative h-4 text-[10px] text-muted-foreground">
          <span className="absolute left-0">0</span>
          <span className="absolute" style={{ left: "50%", transform: "translateX(-50%)" }}>50</span>
          <span className="absolute" style={{ left: "70%", transform: "translateX(-50%)" }}>70</span>
          <span className="absolute right-0">100</span>
        </div>
      </div>

      {/* Component breakdown — bottleneck highlighted */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Thành phần điểm</p>
        <div className="flex flex-col gap-1.5">
          {componentRows.map(({ key, value }) => {
            const isBottleneck = key === bottleneck;
            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded px-2 py-1 text-xs transition-colors ${
                  isBottleneck
                    ? "bg-destructive/5 ring-1 ring-destructive/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <span className={isBottleneck ? "font-medium text-destructive" : "text-muted-foreground"}>
                  {COMPONENT_LABEL[key] ?? key}
                  {isBottleneck && (
                    <span className="ml-1.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">
                      bottleneck
                    </span>
                  )}
                </span>
                <span className={`font-medium tabular-nums ${isBottleneck ? "text-destructive" : "text-foreground"}`}>
                  {toPct(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

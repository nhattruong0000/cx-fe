"use client";

/**
 * DecisionBlock — primary signal card for forecast gate decision.
 * Shows the gate decision badge as source-of-truth (not derived from score),
 * plus any components that failed their thresholds.
 */

import { Badge } from "@/components/ui/badge";
import type { GateDecision, BottleneckComponent } from "@/types/inventory-evidence";

// ─── Config ──────────────────────────────────────────────────────────────────

const DECISION_CFG: Record<
  GateDecision,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "outline" }
> = {
  accept:       { label: "Chấp nhận — dùng dự báo đầy đủ", variant: "success" },
  downgrade:    { label: "Giảm cấp — dùng dự báo thận trọng", variant: "warning" },
  drop:         { label: "Loại bỏ — không dùng dự báo", variant: "destructive" },
  paused:       { label: "Tạm dừng — SKU ngừng theo dõi", variant: "secondary" },
  needs_review: { label: "Cần xem xét — review thủ công", variant: "outline" },
};

/** Thresholds aligned with AlertReliabilityCalculator (BE). */
const COMPONENT_THRESHOLDS: Record<BottleneckComponent, number> = {
  confidence: 0.5,
  lt_quality: 0.5,
  on_hand:    0.3,
};

const COMPONENT_LABEL: Record<BottleneckComponent, string> = {
  confidence: "Độ tin cậy mô hình dự báo",
  lt_quality: "Chất lượng dữ liệu giao hàng",
  on_hand:    "Dữ liệu tồn kho",
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DecisionBlockReason {
  component: BottleneckComponent;
  current: number;
  required: number;
}

interface DecisionBlockProps {
  decision: GateDecision;
  /** Components whose score falls below their required threshold. */
  reasons?: DecisionBlockReason[];
  manualReview?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toPct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DecisionBlock({ decision, reasons = [], manualReview = false }: DecisionBlockProps) {
  const cfg = DECISION_CFG[decision] ?? { label: decision, variant: "outline" as const };

  return (
    <div className="flex flex-col gap-3">
      {/* Primary badge */}
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Quyết định dự báo
        </p>
        {manualReview && (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            Cần review
          </span>
        )}
      </div>
      <Badge variant={cfg.variant} className="w-fit text-xs">
        {cfg.label}
      </Badge>

      {/* Failure reasons — only shown when there are failing components */}
      {reasons.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">Nguyên nhân:</p>
          <ul className="flex flex-col gap-1">
            {reasons.map(({ component, current, required }) => (
              <li key={component} className="flex items-start gap-1.5 text-xs text-destructive">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                <span>
                  {COMPONENT_LABEL[component]}{" "}
                  <span className="font-medium">{toPct(current)}</span>
                  {" < yêu cầu "}
                  <span className="font-medium">{toPct(required)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Build failure-reason list from components map + their thresholds.
 * Exported so callers (reliability-gauge.tsx) can compute it once.
 */
export function buildDecisionReasons(
  components: Record<BottleneckComponent, number>
): DecisionBlockReason[] {
  return (Object.keys(COMPONENT_THRESHOLDS) as BottleneckComponent[])
    .filter((k) => components[k] < COMPONENT_THRESHOLDS[k])
    .map((k) => ({ component: k, current: components[k], required: COMPONENT_THRESHOLDS[k] }));
}

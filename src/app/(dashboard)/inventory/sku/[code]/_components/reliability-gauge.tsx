"use client";

/**
 * ReliabilityGauge — composes DecisionBlock (primary) + DataQualityBlock (secondary).
 *
 * Bugfix: gate_decision is read directly from API, never derived from display_score.
 * When gate_decision is null (legacy data), we derive a display-only fallback from
 * display_score so the UI is never empty — but we never promote score → decision
 * when a real decision value exists.
 *
 * Layout: decision on top (primary signal), quality score below (context).
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import type { EvidenceReliabilityScore, GateDecision, BottleneckComponent, ReliabilityComponents } from "@/types/inventory-evidence";
import { DecisionBlock, buildDecisionReasons } from "./decision-block";
import { DataQualityBlock } from "./data-quality-block";

interface ReliabilityGaugeProps {
  reliability: EvidenceReliabilityScore;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve the effective gate decision.
 * Source-of-truth: API gate_decision field.
 * Fallback (legacy data where gate_decision is null): derive from display_score.
 * This ensures old alerts render sensibly without inventing a hard "drop" for everything.
 */
function resolveGateDecision(reliability: EvidenceReliabilityScore): GateDecision {
  if (reliability.gate_decision) return reliability.gate_decision;
  // Fallback derivation from display_score (backward compat only)
  const pct = Math.round((reliability.display_score ?? reliability.score ?? 0) * 100);
  if (pct >= 70) return "accept";
  if (pct >= 50) return "downgrade";
  return "drop";
}

/**
 * Build components map, supporting both new-shape (components object) and
 * legacy flat fields (confidence / lt_quality / oh_quality).
 */
function resolveComponents(reliability: EvidenceReliabilityScore): ReliabilityComponents {
  if (reliability.components) return reliability.components;
  // Legacy shape fallback
  const conf = typeof reliability.confidence === "number" ? reliability.confidence : 1.0;
  const lt = reliability.lt_quality != null ? Number(reliability.lt_quality) : 1.0;
  const oh = reliability.oh_quality != null ? Number(reliability.oh_quality) : 1.0;
  return { confidence: conf, lt_quality: isNaN(lt) ? 1.0 : lt, on_hand: isNaN(oh) ? 1.0 : oh };
}

/**
 * Resolve display_score from new field or legacy score field.
 */
function resolveDisplayScore(reliability: EvidenceReliabilityScore): number {
  return reliability.display_score ?? reliability.score ?? 0;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReliabilityGauge({ reliability }: ReliabilityGaugeProps) {
  const decision = resolveGateDecision(reliability);
  const components = resolveComponents(reliability);
  const displayScore = resolveDisplayScore(reliability);
  const bottleneck = (reliability.bottleneck_component as BottleneckComponent | null) ?? null;
  const reasons = buildDecisionReasons(components);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          Độ tin cậy dữ liệu
          <HelpTooltip>
            <strong>Quyết định dự báo</strong> là tín hiệu chính — có thể "Loại bỏ" dù điểm cao
            vì còn xét thêm lịch sử bán, độ tin cậy mô hình và các điều kiện vòng đời.
            <br />
            <strong>Điểm chất lượng</strong> là ngữ cảnh bổ sung (0.5·tin cậy + 0.3·giao hàng + 0.2·tồn kho).
          </HelpTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* BLOCK 1 — Decision (primary signal, always on top) */}
        <DecisionBlock
          decision={decision}
          reasons={reasons}
          manualReview={reliability.manual_review_required ?? false}
        />

        {/* Visual separator */}
        <div className="h-px w-full bg-border" />

        {/* BLOCK 2 — Data quality (secondary context) */}
        <DataQualityBlock
          displayScore={displayScore}
          bottleneck={bottleneck}
          components={components}
        />
      </CardContent>
    </Card>
  );
}

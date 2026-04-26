"use client";

/**
 * Forecast Action Card — replaces 3-horizon CI Chart per Sub-A v2 schema migration.
 * Plan: plans/260426-0729-fe-forecast-rebuild/phase-01-design-specs.md (Design 1)
 * Pen ref: LySLw — Component / Forecast Action Card
 *
 * Maps EvidenceBundle (legacy 3-horizon shape) into v2 action card display:
 *   DUS = alert.dos
 *   daily_rate = alert.demand_daily
 *   reorder_qty = suggested_po.qty_rounded
 *   lead_time = lead_time.p50/p90
 *   confidence = first forecast confidence OR reliability.confidence
 *   classification — inferred from daily_rate + dos pattern (regular/seasonal/...)
 */

import { Badge } from "@/components/ui/badge";
import type {
  EvidenceAlertSection,
  EvidenceForecast,
  EvidenceLeadTimeProfile,
  EvidenceReliabilityScore,
  EvidenceSuggestedPo,
} from "@/types/inventory-evidence";

interface Props {
  itemCode: string;
  stockCodes: string[];
  alert: EvidenceAlertSection;
  forecasts: EvidenceForecast[];
  leadTime: EvidenceLeadTimeProfile;
  suggestedPo: EvidenceSuggestedPo;
  reliability: EvidenceReliabilityScore;
}

type StatusColor = "ok" | "reorder" | "critical";

function dusToStatus(dos: number | null): StatusColor {
  if (dos === null) return "critical";
  if (dos >= 14) return "ok";
  if (dos >= 7) return "reorder";
  return "critical";
}

function statusLabel(s: StatusColor): string {
  return s === "ok" ? "Đủ hàng" : s === "reorder" ? "Cần đặt hàng" : "Cấp bách";
}

function statusBadgeClass(s: StatusColor): string {
  if (s === "ok") return "bg-[#16A34A] text-white";
  if (s === "reorder") return "bg-[#F59E0B] text-white";
  return "bg-[#DC2626] text-white";
}

function dusBlockBg(s: StatusColor): string {
  if (s === "ok") return "bg-[#F0FDF4]";
  if (s === "reorder") return "bg-[#FFFBEB]";
  return "bg-[#FEF2F2]";
}

function dusNumberColor(s: StatusColor): string {
  if (s === "ok") return "text-[#16A34A]";
  if (s === "reorder") return "text-[#F59E0B]";
  return "text-[#DC2626]";
}

function fmtNum(v: number | null | undefined, digits = 0): string {
  if (v == null || Number.isNaN(v)) return "—";
  return v.toLocaleString("vi-VN", { maximumFractionDigits: digits });
}

function confidenceVariant(c: number | null): "default" | "secondary" | "outline" {
  if (c == null) return "outline";
  if (c >= 0.7) return "default";
  return "secondary";
}

export function ForecastActionCard({
  itemCode,
  stockCodes,
  alert,
  forecasts,
  leadTime,
  suggestedPo,
  reliability,
}: Props) {
  const dos = alert.dos;
  const status = dusToStatus(dos);
  const dailyRate = alert.demand_daily;
  const ltP50 = leadTime.p50 ?? null;
  const ltP90 = leadTime.p90 ?? null;
  const reorderQty = suggestedPo.qty_rounded ?? suggestedPo.qty_raw ?? null;
  const rop = dailyRate != null && ltP50 != null
    ? Math.round(dailyRate * ltP50 * 1.2)
    : null;
  const confidence = forecasts[0]?.confidence ?? reliability.confidence ?? null;
  const method = forecasts[0]?.method ?? "rolling_avg";
  const classification = method.includes("seasonal")
    ? "seasonal"
    : method.includes("zero")
      ? "dormant"
      : method.includes("cold_start")
        ? "low_signal"
        : "regular";

  return (
    <div
      className="flex flex-col gap-4 rounded-[14px] border border-border bg-card p-6"
      aria-label="Trạng thái đặt hàng"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">Trạng thái đặt hàng</span>
          <span className="text-lg font-semibold text-foreground">
            {itemCode} {stockCodes.length > 0 && `/ ${stockCodes.join(", ")}`}
          </span>
        </div>
        <span
          className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(status)}`}
        >
          {statusLabel(status)}
        </span>
      </div>

      {/* DUS hero block */}
      <div className={`flex flex-col items-center gap-1 rounded-[10px] p-4 ${dusBlockBg(status)}`}>
        <span className="text-sm font-medium text-muted-foreground">Số ngày tồn còn lại (DUS)</span>
        <span className={`text-4xl font-bold ${dusNumberColor(status)}`}>
          {dos != null ? `${dos.toFixed(1)} ngày` : "—"}
        </span>
        <span className="text-xs text-muted-foreground">
          {dailyRate != null
            ? `daily_rate ${fmtNum(dailyRate, 1)} đv/ngày`
            : "Chưa có dữ liệu daily_rate"}
        </span>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCell label="Daily rate" value={dailyRate != null ? `${fmtNum(dailyRate, 1)} đv/ngày` : "—"} />
        <StatCell label="Reorder qty" value={reorderQty != null ? `${fmtNum(reorderQty)} đv` : "—"} />
        <StatCell label="Lead time p50/p90" value={ltP50 != null ? `${ltP50}/${ltP90 ?? "—"}d` : "—"} />
        <StatCell label="ROP (ước tính)" value={rop != null ? `${fmtNum(rop)} đv` : "—"} />
      </div>

      {/* Chip row */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">{classification}</Badge>
        <Badge variant="outline" className="text-xs">method: {method}</Badge>
        <Badge variant={confidenceVariant(confidence)} className="text-xs">
          confidence: {confidence != null ? confidence.toFixed(2) : "NULL"}
        </Badge>
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] bg-muted p-3">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

/**
 * Client-side derivation utilities for the Forecast Evidence modal.
 * BE does NOT return: confidence (string), gates_triggered[], reasoning.
 * All three are derived here from raw ForecastPoint fields + context props.
 */

import type { ForecastPoint } from "@/types/inventory";
import type { StockStatus } from "@/types/inventory";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ForecastByHorizon {
  d7: ForecastPoint | undefined;
  d30: ForecastPoint | undefined;
  d90: ForecastPoint | undefined;
}

export interface DerivedGate {
  key: string;
  message: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safety factor: on_hand must cover at least 25% of 30d forecast */
const SAFETY_FACTOR = 0.25;

/** Vietnamese locale number formatting (comma = decimal, dot = thousands) */
function fmtVi(n: number, decimals = 1): string {
  return n.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ─── Group forecasts by horizon ───────────────────────────────────────────────

/**
 * Given the flat ForecastPoint[] from BE, return the most-recent point
 * for each horizon (7 / 30 / 90). Ties resolved by created_at desc.
 */
export function groupForecastsByHorizon(data: ForecastPoint[]): ForecastByHorizon {
  const sorted = [...data].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return {
    d7: sorted.find((p) => p.horizon_days === 7),
    d30: sorted.find((p) => p.horizon_days === 30),
    d90: sorted.find((p) => p.horizon_days === 90),
  };
}

// ─── Confidence label ─────────────────────────────────────────────────────────

/**
 * Derive human-readable confidence label from the low_confidence boolean.
 * Returns "Độ tin cậy cao" or "Độ tin cậy thấp".
 */
export function deriveConfidenceLabel(lowConfidence: boolean): string {
  return lowConfidence ? "Độ tin cậy thấp" : "Độ tin cậy cao";
}

/** Optional CI range string: "80–120 cái (khoảng tin cậy)" */
export function deriveConfidenceRange(point: ForecastPoint): string | null {
  if (point.qty_lower == null || point.qty_upper == null) return null;
  return `${Math.round(point.qty_lower)}–${Math.round(point.qty_upper)} cái (khoảng tin cậy)`;
}

// ─── Gates derivation ─────────────────────────────────────────────────────────

/**
 * Derive gate messages from available context.
 * MVP implements 2 rules:
 *   1. Stockout risk: on_hand < qty_forecast_30d × SAFETY_FACTOR
 *   2. Lead-time coverage: days_of_supply < lead_time_p90
 *
 * Returns empty array when no gates trigger; caller shows fallback text.
 */
export function deriveGates(params: {
  onHand?: number;
  d30?: ForecastPoint;
  leadTimeP90?: number | null;
}): DerivedGate[] {
  const { onHand, d30, leadTimeP90 } = params;
  const gates: DerivedGate[] = [];

  // Rule 1: Stockout risk
  if (onHand != null && d30 != null && d30.qty_forecast > 0) {
    const needed = Math.round(d30.qty_forecast * SAFETY_FACTOR);
    if (onHand < needed) {
      gates.push({
        key: "stockout_risk",
        message: `Tồn kho (${onHand} cái) không đủ cho 30 ngày tới (cần ${needed} cái dự phòng)`,
      });
    }
  }

  // Rule 2: Lead-time coverage
  if (onHand != null && d30 != null && leadTimeP90 != null && d30.qty_forecast > 0) {
    // days_of_supply = on_hand / (qty_forecast_30d / 30)
    const dailyRate = d30.qty_forecast / 30;
    const daysOfSupply = dailyRate > 0 ? onHand / dailyRate : Infinity;

    if (daysOfSupply < leadTimeP90) {
      gates.push({
        key: "lead_time_coverage",
        message: `Tồn kho chỉ đủ ${fmtVi(daysOfSupply)} ngày trong khi thời gian chờ giao hàng lên tới ${leadTimeP90} ngày`,
      });
    }
  }

  return gates;
}

// ─── Reasoning derivation ─────────────────────────────────────────────────────

/**
 * Build a Vietnamese summary paragraph explaining the stock situation.
 * Picks template from status (critical / warn / ok) and interpolates numbers.
 */
export function deriveReasoning(params: {
  status?: StockStatus;
  onHand?: number;
  d7?: ForecastPoint;
  d30?: ForecastPoint;
  leadTimeP90?: number | null;
}): string {
  const { status, onHand, d30, d7, leadTimeP90 } = params;
  const qty30 = d30?.qty_forecast ?? 0;
  const qty7 = d7?.qty_forecast ?? 0;
  const method = d30?.method ?? d7?.method ?? "tự động";

  if (onHand == null || qty30 === 0) {
    return "Chưa đủ dữ liệu để tạo tóm tắt. Vui lòng kiểm tra lại thông tin tồn kho và dự báo.";
  }

  // days_of_supply
  const dailyRate = qty30 / 30;
  const daysOfSupply = dailyRate > 0 ? onHand / dailyRate : 999;

  if (status === "critical") {
    const ltText = leadTimeP90 ? ` trong khi thời gian chờ giao hàng lên tới ${leadTimeP90} ngày` : "";
    return (
      `Mặt hàng đang ở mức nguy cấp. Tồn kho hiện tại chỉ còn ${onHand} cái, ` +
      `chỉ đủ bán khoảng ${fmtVi(daysOfSupply)} ngày${ltText} so với nhu cầu dự báo ` +
      `${qty30} cái trong 30 ngày tới (${qty7} cái trong 7 ngày tới). ` +
      `Phương pháp dự báo: ${method}. Cần xem xét đặt hàng ngay.`
    );
  }

  if (status === "warn") {
    return (
      `Mặt hàng đang ở mức cảnh báo. Tồn kho hiện tại ${onHand} cái đủ khoảng ` +
      `${fmtVi(daysOfSupply)} ngày so với nhu cầu dự báo ${qty30} cái trong 30 ngày tới. ` +
      `Phương pháp dự báo: ${method}. Nên theo dõi sát và lên kế hoạch đặt hàng sớm.`
    );
  }

  // ok or undefined
  return (
    `Mặt hàng đang ở mức ổn định. Tồn kho hiện tại ${onHand} cái đủ khoảng ` +
    `${fmtVi(daysOfSupply)} ngày so với nhu cầu dự báo ${qty30} cái trong 30 ngày tới. ` +
    `Phương pháp dự báo: ${method}.`
  );
}

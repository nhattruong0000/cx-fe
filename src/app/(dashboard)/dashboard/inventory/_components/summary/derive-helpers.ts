// Pure utility functions for inventory dashboard summary calculations and display formatting.
// All functions are side-effect-free and locale-aware (Asia/Saigon).

import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

/** Format a float days-of-cover value to "X ngày" or "< 1 ngày" */
export function formatDaysCover(days: number): string {
  if (days < 1) return "< 1 ngày";
  return `${Math.round(days)} ngày`;
}

/** Format drift days: positive = overdue, negative = upcoming */
export function formatDaysDrift(days: number): string {
  if (days === 0) return "Đúng hạn";
  if (days > 0) return `Trễ ${days} ngày`;
  return `Còn ${Math.abs(days)} ngày`;
}

/** Format risk score (0–100 scale) to 1 decimal */
export function formatRiskScore(score: number): string {
  return score.toFixed(1);
}

/** Format percentage to "XX%" (no decimals) */
export function formatPct(value: number): string {
  return `${Math.round(value)}%`;
}

/** Format ISO timestamp to "HH:mm" in Asia/Saigon locale */
export function formatLastUpdated(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, "HH:mm", { locale: vi });
  } catch {
    return "--:--";
  }
}

/** Format avg_gap_days for supplier cadence display */
export function formatAvgGap(days: number): string {
  return `${Math.round(days)} ngày/lần`;
}

/** Derive color class for days_of_cover urgency */
export function docUrgencyClass(days: number): string {
  if (days < 7) return "text-destructive font-semibold";
  if (days < 14) return "text-yellow-600 font-medium";
  return "text-foreground";
}

/** Map PoStatus to Vietnamese badge label */
export function formatPoStatus(status: "upcoming" | "overdue"): string {
  return status === "overdue" ? "Quá hạn" : "Sắp đến";
}

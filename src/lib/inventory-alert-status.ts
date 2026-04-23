/**
 * Derive UI alert status from evidence bundle.
 * Distinguishes "insufficient_data" from real severities so FE
 * doesn't mislead users when forecast cannot be computed.
 */

import type { InventoryEvidenceBundle } from "@/types/inventory-evidence";

export type AlertUiStatus =
  | "critical"
  | "warn"
  | "warning"
  | "stockout"
  | "ok"
  | "insufficient_data";

export interface AlertStatusConfig {
  label: string;
  variant: "destructive" | "warning" | "success" | "secondary";
}

export const ALERT_STATUS_CONFIG: Record<AlertUiStatus, AlertStatusConfig> = {
  critical: { label: "Nguy cấp", variant: "destructive" },
  stockout: { label: "Đã hết", variant: "destructive" },
  warn: { label: "Cảnh báo", variant: "warning" },
  warning: { label: "Sắp hết", variant: "warning" },
  ok: { label: "Bình thường", variant: "success" },
  insufficient_data: { label: "Chưa đủ dữ liệu", variant: "secondary" },
};

/**
 * Returns UI status for alert card / badges.
 * Rule: when BE severity is null AND there is no daily demand to compute
 * forecast/DOS, surface "insufficient_data" instead of faking "ok".
 */
export function getAlertUiStatus(
  evidence: Pick<InventoryEvidenceBundle, "alert" | "on_hand">,
): AlertUiStatus {
  const { alert } = evidence;
  if (alert.severity) return alert.severity as AlertUiStatus;
  if (alert.demand_daily == null) return "insufficient_data";
  return "ok";
}

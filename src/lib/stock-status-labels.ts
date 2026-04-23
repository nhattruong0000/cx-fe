import type { StockStatus } from "@/types/inventory";

/**
 * Single source of truth for Vietnamese stock status labels.
 * Used by both filter chips (toolbar) and row badges to ensure label consistency.
 * Maps StockStatus enum values → display labels.
 */
export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  ok: "Ổn định",
  warn: "Cảnh báo",
  critical: "Nguy cấp",
};

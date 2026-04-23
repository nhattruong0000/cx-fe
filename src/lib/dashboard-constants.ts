// Constants for inventory dashboard behavior and data quality thresholds.

/** Data staleness banner threshold in milliseconds (24 hours) */
export const DASHBOARD_STALENESS_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/**
 * Banner message template for stale dashboard data.
 * @param hoursAgo - number of hours since last sync (rounded)
 */
export function buildStalenessMessage(hoursAgo: number): string {
  return `Dữ liệu cập nhật ${hoursAgo} giờ trước. Đồng bộ AMIS có thể bị trễ.`;
}

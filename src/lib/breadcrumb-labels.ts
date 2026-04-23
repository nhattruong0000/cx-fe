/**
 * Centralized slug → Vietnamese breadcrumb label map.
 * Used by DashboardTopBar to translate URL path segments to localized labels.
 * Dynamic segments (UUIDs, codes) are NOT in this map — they display raw value.
 */
export const BREADCRUMB_LABELS: Record<string, string> = {
  // Core admin
  dashboard: "Bảng điều khiển",
  users: "Người dùng",
  profile: "Hồ sơ",
  security: "Bảo mật",
  notifications: "Thông báo",
  invite: "Mời người dùng",
  "permission-groups": "Nhóm quyền hạn",
  organizations: "Tổ chức",
  settings: "Cài đặt",
  help: "Trung tâm trợ giúp",
  // Inventory feature group
  inventory: "Tồn kho",
  suppliers: "Nhà cung cấp",
  "purchase-orders": "Đơn nhập (PO)",
  alerts: "Cảnh báo tồn",
  sku: "SKU",
};

/**
 * Returns the Vietnamese label for a URL slug.
 * Falls back to the raw slug if no mapping exists (e.g. dynamic id/code segments).
 */
export function getBreadcrumbLabel(slug: string): string {
  return BREADCRUMB_LABELS[slug] ?? slug;
}

import type { UserRole } from "@/types/dashboard";

export interface NavChild {
  label: string;
  href: string;
  icon?: string; // lucide icon name (optional — used by collapsible groups)
  disabled?: boolean;
  adminOnly?: boolean;
  active?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  disabled?: boolean;
  badge?: string;
  /** Optional collapsible children. When present, item acts as a parent group. */
  children?: NavChild[];
  active?: boolean;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

const DASHBOARD_PARENT_ADMIN: NavItem = {
  label: "Bảng điều khiển",
  href: "/dashboard",
  icon: "house",
  children: [
    { label: "Tổng quan", href: "/dashboard" },
    { label: "Kho & Dự báo", href: "/dashboard/inventory" },
    { label: "Hệ thống", href: "/dashboard/system", adminOnly: true },
  ],
};

const DASHBOARD_PARENT_STAFF: NavItem = {
  label: "Bảng điều khiển",
  href: "/dashboard",
  icon: "house",
  children: [
    { label: "Tổng quan", href: "/dashboard" },
    { label: "Kho & Dự báo", href: "/dashboard/inventory" },
  ],
};

/** Kho & Mua hàng group — shared by admin and staff */
const INVENTORY_NAV_ITEM: NavItem = {
  label: "Kho & Mua hàng",
  href: "/inventory",
  icon: "warehouse",
  children: [
    { label: "Tồn kho", href: "/inventory", icon: "package" },
    { label: "Nhà cung cấp", href: "/inventory/suppliers", icon: "truck" },
    { label: "Đơn nhập (PO)", href: "/purchase-orders", icon: "file-text" },
    { label: "Cảnh báo tồn", href: "/inventory/alerts", icon: "alert-triangle" },
  ],
};

const ADMIN_SECTIONS: NavSection[] = [
  {
    label: "QUẢN TRỊ",
    items: [
      DASHBOARD_PARENT_ADMIN,
      INVENTORY_NAV_ITEM,
      { label: "Người dùng", href: "/users", icon: "users" },
      { label: "Lời mời", href: "/invitations", icon: "mail" },
      { label: "Nhóm quyền hạn", href: "/permission-groups", icon: "lock" },
      { label: "Tổ chức", href: "/organizations", icon: "building-2" },
      { label: "Cài đặt", href: "/settings", icon: "settings" },
    ],
  },
  {
    label: "THAO TÁC NHANH",
    items: [
      { label: "Mời người dùng", href: "/invite", icon: "user-plus", badge: "mới" },
      { label: "Trung tâm trợ giúp", href: "/help", icon: "life-buoy" },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      { label: "Hồ sơ", href: "/profile", icon: "user" },
      { label: "Bảo mật", href: "/security", icon: "shield" },
      { label: "Thông báo", href: "/notifications", icon: "bell" },
    ],
  },
];

const STAFF_SECTIONS: NavSection[] = [
  {
    label: "ĐIỀU HƯỚNG",
    items: [
      DASHBOARD_PARENT_STAFF,
      INVENTORY_NAV_ITEM,
      { label: "Khảo sát của tôi", href: "/surveys", icon: "clipboard-list" },
      { label: "Yêu cầu hỗ trợ", href: "/support", icon: "headset" },
      { label: "Báo cáo", href: "/reports", icon: "file-text" },
      { label: "Cài đặt", href: "/settings", icon: "settings", disabled: true },
    ],
  },
  {
    label: "THAO TÁC NHANH",
    items: [
      { label: "Mời người dùng", href: "/invite", icon: "user-plus", disabled: true },
      { label: "Trung tâm trợ giúp", href: "/help", icon: "life-buoy", disabled: true },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      { label: "Hồ sơ", href: "/profile", icon: "user" },
      { label: "Bảo mật", href: "/security", icon: "shield" },
      { label: "Thông báo", href: "/notifications", icon: "bell" },
    ],
  },
];

const CUSTOMER_SECTIONS: NavSection[] = [
  {
    label: "ĐIỀU HƯỚNG",
    items: [
      { label: "Bảng điều khiển", href: "/dashboard", icon: "house" },
      { label: "Khảo sát của tôi", href: "/surveys", icon: "clipboard-list" },
      { label: "Hỗ trợ", href: "/support", icon: "headset" },
      { label: "Cài đặt", href: "/settings", icon: "settings" },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      { label: "Hồ sơ", href: "/profile", icon: "user" },
      { label: "Tổ chức", href: "/my-organization", icon: "building-2" },
      { label: "Bảo mật", href: "/security", icon: "shield", disabled: true },
      { label: "Thông báo", href: "/notifications", icon: "bell", disabled: true },
    ],
  },
];

const NAV_BY_ROLE: Record<string, NavSection[]> = {
  admin: ADMIN_SECTIONS,
  staff: STAFF_SECTIONS,
  customer: CUSTOMER_SECTIONS,
};

function isActive(href: string, pathname: string, exact = false): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

/** Returns sidebar nav sections for a given role. Marks active item by pathname. */
export function getSidebarNavConfig(role: UserRole, pathname: string): NavSection[] {
  const sections = NAV_BY_ROLE[role] ?? [];
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.children && item.children.length > 0) {
        const filtered = item.children.filter((c) => !c.adminOnly || role === "admin");
        // Only the child with the longest matching href should be active,
        // otherwise parent routes (e.g. /inventory) also match sub-routes (e.g. /inventory/suppliers).
        let bestHref = "";
        for (const c of filtered) {
          const matches = isActive(c.href, pathname, c.href === "/dashboard");
          if (matches && c.href.length > bestHref.length) bestHref = c.href;
        }
        const children = filtered.map((c) => ({ ...c, active: c.href === bestHref }));
        return { ...item, children, active: bestHref !== "" };
      }
      return { ...item, active: isActive(item.href, pathname) };
    }),
  }));
}

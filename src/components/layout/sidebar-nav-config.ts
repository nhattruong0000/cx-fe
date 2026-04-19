import type { UserRole } from "@/types/dashboard";

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  disabled?: boolean;
  badge?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

const ADMIN_SECTIONS: NavSection[] = [
  {
    label: "QUẢN TRỊ",
    items: [
      { label: "Bảng điều khiển", href: "/dashboard", icon: "house" },
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
      { label: "Bảng điều khiển", href: "/dashboard", icon: "house" },
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

/** Returns sidebar nav sections for a given role. Marks active item by pathname. */
export function getSidebarNavConfig(role: UserRole, pathname: string): NavSection[] {
  const sections = NAV_BY_ROLE[role] ?? [];
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      active: pathname === item.href || pathname.startsWith(item.href + "/"),
    })),
  }));
}

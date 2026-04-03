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
      { label: "Dashboard", href: "/dashboard", icon: "house" },
      { label: "Users", href: "/users", icon: "users" },
      { label: "Permission Groups", href: "/permission-groups", icon: "lock" },
      { label: "Organizations", href: "/organizations", icon: "building-2" },
      { label: "Settings", href: "/settings", icon: "settings" },
    ],
  },
  {
    label: "THAO TÁC NHANH",
    items: [
      { label: "Invite User", href: "/invite", icon: "user-plus", badge: "new" },
      { label: "Help Center", href: "/help", icon: "life-buoy" },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      { label: "Profile", href: "/profile", icon: "user" },
      { label: "Security", href: "/security", icon: "shield" },
      { label: "Notifications", href: "/notifications", icon: "bell" },
    ],
  },
];

const STAFF_SECTIONS: NavSection[] = [
  {
    label: "ĐIỀU HƯỚNG",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "house" },
      { label: "My Surveys", href: "/surveys", icon: "clipboard-list" },
      { label: "Support Requests", href: "/support", icon: "headset" },
      { label: "Reports", href: "/reports", icon: "file-text" },
      { label: "Settings", href: "/settings", icon: "settings", disabled: true },
    ],
  },
  {
    label: "THAO TÁC NHANH",
    items: [
      { label: "Invite User", href: "/invite", icon: "user-plus", disabled: true },
      { label: "Help Center", href: "/help", icon: "life-buoy", disabled: true },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      { label: "Profile", href: "/profile", icon: "user" },
      { label: "Security", href: "/security", icon: "shield" },
      { label: "Notifications", href: "/notifications", icon: "bell" },
    ],
  },
];

const CUSTOMER_SECTIONS: NavSection[] = [
  {
    label: "ĐIỀU HƯỚNG",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "house" },
      { label: "My Surveys", href: "/surveys", icon: "clipboard-list" },
      { label: "Support", href: "/support", icon: "headset" },
      { label: "Settings", href: "/settings", icon: "settings" },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      { label: "Profile", href: "/profile", icon: "user" },
      { label: "Tổ chức", href: "/my-organization", icon: "building-2" },
      { label: "Security", href: "/security", icon: "shield", disabled: true },
      { label: "Notifications", href: "/notifications", icon: "bell", disabled: true },
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

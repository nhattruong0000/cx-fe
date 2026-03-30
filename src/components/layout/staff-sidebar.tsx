"use client";

import {
  Home,
  ClipboardList,
  Wrench,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { usePermissions } from "@/hooks/use-permissions";
import { SidebarNavItem } from "./sidebar-nav-item";
import { UserMenuDropdown } from "./user-menu-dropdown";

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home, permissions: [] as string[] },
  {
    href: "/surveys",
    label: "Khảo sát",
    icon: ClipboardList,
    permissions: ["survey:create", "survey:edit", "survey:view_responses"],
  },
  {
    href: "/schedules",
    label: "Lịch hỗ trợ",
    icon: Wrench,
    permissions: ["support:manage", "support:update", "support:view_all"],
  },
  {
    href: "/analytics",
    label: "Phân tích",
    icon: BarChart3,
    permissions: ["analytics:view"],
  },
  {
    href: "/settings/users",
    label: "Cài đặt",
    icon: Settings,
    permissions: [],
    adminOnly: true,
  },
];

export function StaffSidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const { canAny, role } = usePermissions();

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly && role !== "admin") return false;
    return canAny(item.permissions);
  });

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + toggle */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <span className="text-lg font-semibold text-primary">CX Platform</span>
        )}
        <button
          onClick={toggle}
          className="rounded-md p-1.5 hover:bg-accent"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {visibleItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* User menu at bottom */}
      <div className="border-t p-2">
        <UserMenuDropdown />
      </div>
    </aside>
  );
}

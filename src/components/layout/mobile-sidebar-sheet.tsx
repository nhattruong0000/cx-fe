"use client";

import {
  Home,
  ClipboardList,
  Wrench,
  BarChart3,
  Settings,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usePermissions } from "@/hooks/use-permissions";
import { SidebarNavItem } from "./sidebar-nav-item";

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

interface MobileSidebarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebarSheet({
  open,
  onOpenChange,
}: MobileSidebarSheetProps) {
  const { canAny, role } = usePermissions();

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly && role !== "admin") return false;
    return canAny(item.permissions);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="text-lg text-primary">CX Platform</SheetTitle>
        </SheetHeader>
        <nav className="space-y-1 p-2">
          {visibleItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

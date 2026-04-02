"use client";

import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { getSidebarNavConfig } from "./sidebar-nav-config";
import { SidebarNavItem } from "./sidebar-nav-item";
import type { UserRole } from "@/types/dashboard";

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const sections = getSidebarNavConfig(role, pathname);

  return (
    <aside className="flex w-[260px] shrink-0 flex-col overflow-hidden border-r border-[#E4E4E7] bg-[#F8FAFC]">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-[#E4E4E7] px-2">
        <BarChart3 className="h-6 w-6 text-[#2556C5]" />
        <span className="text-[17px] font-bold text-[#0F172A]">SonNguyen CX</span>
      </div>

      {/* Nav sections — scrollable */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 pb-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-2 pb-1 pt-2.5 text-[11px] font-bold uppercase tracking-[0.5px] text-[#94A3B8]">
              {section.label}
            </p>
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <SidebarNavItem key={item.href} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

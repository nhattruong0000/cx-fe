"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { BarChart3, ChevronRight } from "lucide-react";
import { getSidebarNavConfig } from "./sidebar-nav-config";
import { SidebarNavItem } from "./sidebar-nav-item";
import { useAuthStore } from "@/stores/auth-store";
import { getUserInitials } from "@/lib/user-initials";
import type { UserRole } from "@/types/dashboard";

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const sections = getSidebarNavConfig(role, pathname);

  const [imgError, setImgError] = useState(false);
  const initials = getUserInitials(user?.full_name);
  const showAvatar = user?.avatar_url && !imgError;

  return (
    <aside className="flex w-[260px] flex-col border-r border-[#E4E4E7] bg-[#F8FAFC]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 pb-4 pt-2">
        <BarChart3 className="h-6 w-6 text-[#2556C5]" />
        <span className="text-[17px] font-bold text-[#0F172A]">SonNguyen CX</span>
      </div>

      {/* Separator */}
      <div className="mx-3.5 h-px bg-[#E2E8F0]" />

      {/* Nav sections */}
      <nav className="flex-1 space-y-1.5 px-3.5 pt-1.5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-4 pb-1 pt-2.5 text-[11px] font-bold uppercase tracking-[0.5px] text-[#94A3B8]">
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

      {/* Separator */}
      <div className="mx-3.5 h-px bg-[#E2E8F0]" />

      {/* User footer */}
      <div className="flex items-center gap-3 px-3.5 py-3">
        {showAvatar ? (
          <img
            src={user.avatar_url!}
            alt={user.full_name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-[13px] font-semibold text-white">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0F172A]">{user?.full_name}</p>
          <p className="truncate text-xs text-[#64748B]">{user?.email}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />
      </div>
    </aside>
  );
}

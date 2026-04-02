"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { sidebarIconMap } from "./sidebar-icon-map";

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
}

export function SidebarNavItem({ label, href, icon, active, disabled, badge }: SidebarNavItemProps) {
  const Icon = sidebarIconMap[icon];

  return (
    <Link
      href={href}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-colors",
        active && "bg-[#2556C5] font-semibold text-white",
        !active && !disabled && "text-[#334155] hover:bg-muted",
        disabled && "pointer-events-none opacity-50"
      )}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
    >
      {Icon && <Icon className={cn("h-5 w-5 shrink-0", !active && "text-[#64748B]")} />}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#EF4444]" />
      )}
    </Link>
  );
}

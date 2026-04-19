"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarIconMap } from "./sidebar-icon-map";
import type { NavChild } from "./sidebar-nav-config";

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  children?: NavChild[];
}

export function SidebarNavItem({
  label,
  href,
  icon,
  active,
  disabled,
  badge,
  children,
}: SidebarNavItemProps) {
  const Icon = sidebarIconMap[icon];
  const hasChildren = Array.isArray(children) && children.length > 0;
  const [open, setOpen] = useState<boolean>(Boolean(active));

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  if (!hasChildren) {
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

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-colors",
          active && "font-semibold text-[#0F172A]",
          !active && "text-[#334155] hover:bg-muted"
        )}
      >
        {Icon && <Icon className={cn("h-5 w-5 shrink-0", !active && "text-[#64748B]")} />}
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 shrink-0 text-[#64748B] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <ul className="mt-1 space-y-0.5 pl-9">
          {children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={child.disabled ? (e) => e.preventDefault() : undefined}
                className={cn(
                  "block rounded-full px-3 py-1.5 text-[13px] transition-colors",
                  child.active && "bg-[#2556C5] font-semibold text-white",
                  !child.active && !child.disabled && "text-[#475569] hover:bg-muted",
                  child.disabled && "pointer-events-none text-[#94A3B8]"
                )}
                aria-disabled={child.disabled}
                tabIndex={child.disabled ? -1 : undefined}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

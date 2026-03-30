"use client";

import { PanelLeft } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { UserMenuDropdown } from "./user-menu-dropdown";

export function StaffHeader() {
  const toggle = useSidebarStore((s) => s.toggle);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-3">
        {/* Mobile toggle - visible on small screens */}
        <button
          onClick={toggle}
          className="rounded-md p-1.5 hover:bg-accent lg:hidden"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <BreadcrumbNav />
      </div>
      <div className="flex items-center gap-2">
        <UserMenuDropdown />
      </div>
    </header>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutDashboard, ClipboardList, MessageSquare, BarChart3, Route, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarNavItem } from "./sidebar-nav-item";

const SIDEBAR_KEY = "cx-sidebar-collapsed";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/surveys", label: "Khảo sát", icon: ClipboardList },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/analytics", label: "Phân tích", icon: BarChart3 },
  { href: "/journey", label: "Hành trình", icon: Route },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  }, []);

  if (!mounted) {
    return <aside className="hidden md:block w-64 border-r bg-sidebar" />;
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-sidebar transition-all duration-200",
        collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
      )}
    >
      <div className={cn("flex items-center h-[var(--header-height)] border-b px-4", collapsed && "justify-center px-2")}>
        {!collapsed && <span className="text-lg font-bold text-sidebar-foreground">CX App</span>}
        <Button variant="ghost" size="icon" onClick={toggle} className={cn("h-8 w-8 shrink-0", !collapsed && "ml-auto")}>
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <SidebarNavItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
}

export { navItems };

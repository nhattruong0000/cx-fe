"use client"

import { useEffect } from "react"
import { useSidebarStore } from "@/stores/sidebar-store"
import { useAuthStore } from "@/stores/auth-store"
import { sidebarNavSections } from "@/config/sidebar-nav-config"
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item"
import { OrgSwitcher } from "@/components/layout/org-switcher"
import { UserMenuDropdown } from "@/components/layout/user-menu-dropdown"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function SidebarShell() {
  const collapsed = useSidebarStore((s) => s.collapsed)
  const mounted = useSidebarStore((s) => s.mounted)
  const toggle = useSidebarStore((s) => s.toggle)
  const hydrate = useSidebarStore((s) => s.hydrate)
  const userRole = useAuthStore((s) => s.user?.role)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  // Filter nav items by role
  const filteredSections = sidebarNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !item.requiredRole || userRole === "admin" || userRole === item.requiredRole
      ),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex h-full flex-col border-r bg-sidebar transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-60",
        !mounted && "opacity-0"
      )}
    >
      {/* Header: Org switcher + collapse toggle */}
      <div className="flex items-center gap-2 p-3">
        <OrgSwitcher collapsed={collapsed} />
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            className="ml-auto shrink-0"
            aria-label="Thu gọn sidebar"
          >
            <PanelLeftCloseIcon className="size-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center px-2 pb-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            aria-label="Mở rộng sidebar"
          >
            <PanelLeftOpenIcon className="size-4" />
          </Button>
        </div>
      )}

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-2">
        {filteredSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <Separator />

      {/* Footer: User menu */}
      <div className="p-2">
        <UserMenuDropdown collapsed={collapsed} />
      </div>
    </aside>
  )
}

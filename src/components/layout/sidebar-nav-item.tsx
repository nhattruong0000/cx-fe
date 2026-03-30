"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Tooltip } from "@base-ui/react/tooltip"
import type { LucideIcon } from "lucide-react"

interface SidebarNavItemProps {
  href: string
  label: string
  icon: LucideIcon
  collapsed?: boolean
}

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  collapsed,
}: SidebarNavItemProps) {
  const pathname = usePathname()
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href))

  const linkContent = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive &&
          "bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/15 hover:text-sidebar-primary",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger render={linkContent} />
        <Tooltip.Portal>
          <Tooltip.Positioner side="right" sideOffset={8}>
            <Tooltip.Popup className="z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md">
              {label}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    )
  }

  return linkContent
}

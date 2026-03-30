"use client"

import { useAuthStore } from "@/stores/auth-store"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { BuildingIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrgSwitcherProps {
  collapsed?: boolean
}

export function OrgSwitcher({ collapsed }: OrgSwitcherProps) {
  const user = useAuthStore((s) => s.user)
  const activeOrganizationId = useAuthStore((s) => s.activeOrganizationId)
  const setActiveOrganization = useAuthStore((s) => s.setActiveOrganization)

  const orgs = user?.organizations ?? []
  const activeOrg = orgs.find(
    (o) => o.organization_id === activeOrganizationId
  )

  if (orgs.length <= 1) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2",
          collapsed && "justify-center px-2"
        )}
      >
        <BuildingIcon className="size-4 shrink-0 text-sidebar-foreground/70" />
        {!collapsed && (
          <span className="truncate text-sm font-medium text-sidebar-foreground">
            {activeOrg?.organization_name ?? "Tổ chức"}
          </span>
        )}
      </div>
    )
  }

  return (
    <Select
      value={activeOrganizationId ?? undefined}
      onValueChange={(value) => { if (value) setActiveOrganization(value) }}
    >
      <SelectTrigger
        className={cn(
          "w-full border-sidebar-border bg-sidebar hover:bg-sidebar-accent",
          collapsed && "w-auto px-2"
        )}
      >
        <SelectValue placeholder="Chọn tổ chức">
          <BuildingIcon className="size-4 shrink-0" />
          {!collapsed && (
            <span className="truncate">
              {activeOrg?.organization_name ?? "Chọn tổ chức"}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {orgs.map((org) => (
          <SelectItem key={org.organization_id} value={org.organization_id}>
            {org.organization_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

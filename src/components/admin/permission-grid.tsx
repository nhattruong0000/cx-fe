"use client"

import * as React from "react"
import { UsersIcon, ClipboardListIcon, BarChartIcon, HeadphonesIcon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { PERMISSION_MODULES } from "@/types/admin"

// Map icon string keys from PERMISSION_MODULES to lucide components
const MODULE_ICONS: Record<string, React.ElementType> = {
  users: UsersIcon,
  "clipboard-list": ClipboardListIcon,
  "chart-bar": BarChartIcon,
  headset: HeadphonesIcon,
}

interface PermissionGridProps {
  value: string[]
  onChange: (perms: string[]) => void
}

/** Reusable permission switch grid — 2-column layout of module cards */
export function PermissionGrid({ value, onChange }: PermissionGridProps) {
  const modules = Object.entries(PERMISSION_MODULES)

  const togglePermission = (permKey: string) => {
    if (value.includes(permKey)) {
      onChange(value.filter((p) => p !== permKey))
    } else {
      onChange([...value, permKey])
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {modules.map(([moduleName, module]) => {
        const Icon = MODULE_ICONS[module.icon] ?? UsersIcon
        const permEntries = Object.entries(module.permissions)
        const enabledCount = permEntries.filter(([key]) => value.includes(key)).length

        return (
          <div
            key={moduleName}
            className="flex flex-col gap-4 rounded-[14px] border border-[#E4E4E7] p-5"
          >
            {/* Card header: icon + title + badge */}
            <div className="flex items-center gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: module.bg }}
              >
                <Icon className="size-4" style={{ color: module.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#09090B] leading-tight">{moduleName}</p>
                <p className="text-xs text-[#71717A]">
                  {enabledCount}/{permEntries.length} quyền
                </p>
              </div>
            </div>

            {/* Permission rows */}
            <div className="flex flex-col gap-3">
              {permEntries.map(([permKey, perm]) => {
                const checked = value.includes(permKey)
                return (
                  <div key={permKey} className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#09090B]">{perm.label}</p>
                      <p className="text-xs text-[#71717A]">{perm.description}</p>
                    </div>
                    <Switch
                      checked={checked}
                      onCheckedChange={() => togglePermission(permKey)}
                      className="shrink-0 mt-0.5"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

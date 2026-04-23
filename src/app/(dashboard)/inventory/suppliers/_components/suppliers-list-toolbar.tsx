"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

interface SuppliersListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

/** Search toolbar for the suppliers list — search only (no cadence filter per BE spec) */
export function SuppliersListToolbar({
  search,
  onSearchChange,
}: SuppliersListToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Tìm kiếm mã, tên nhà cung cấp..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-[10px] border border-border bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { StockStatus } from "@/types/inventory"
import { STOCK_STATUS_LABELS } from "@/lib/stock-status-labels"
import { SkuListStockFilter } from "./sku-list-stock-filter"
import { PausedFilterToggle } from "./paused-filter-toggle"

/** Status filter chip config — labels from STOCK_STATUS_LABELS to match row badges */
const STATUS_CHIPS: Array<{ value: StockStatus | "all"; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "ok", label: STOCK_STATUS_LABELS.ok },
  { value: "warn", label: STOCK_STATUS_LABELS.warn },
  { value: "critical", label: STOCK_STATUS_LABELS.critical },
]

interface SkuListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: StockStatus | "all"
  onStatusFilterChange: (value: StockStatus | "all") => void
  stockCodes: string[]
  onStockCodesChange: (codes: string[]) => void
  includePaused: boolean
  onIncludePausedChange: (value: boolean) => void
}

/** Search input + stock filter + status filter chips + paused toggle for SKU inventory list */
export function SkuListToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stockCodes,
  onStockCodesChange,
  includePaused,
  onIncludePausedChange,
}: SkuListToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: search + stock filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Tìm kiếm SKU, tên..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-[10px] border border-border bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Stock (kho) multi-select filter */}
        <SkuListStockFilter selected={stockCodes} onChange={onStockCodesChange} />
      </div>

      {/* Row 2: status chips + paused toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => onStatusFilterChange(chip.value)}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
              statusFilter === chip.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {chip.label}
          </button>
        ))}
        {/* Paused SKU toggle — separated visually from stock-status chips */}
        <div className="ml-2 h-5 w-px bg-border" aria-hidden="true" />
        <PausedFilterToggle value={includePaused} onChange={onIncludePausedChange} />
      </div>
    </div>
  )
}

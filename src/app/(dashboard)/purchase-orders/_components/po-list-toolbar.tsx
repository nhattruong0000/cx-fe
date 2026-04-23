"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { PurchaseOrderStatus } from "@/types/inventory"
import { useInventorySuppliers } from "@/hooks/use-inventory-suppliers"

/** Status filter chips — uses actual BE STATUS_LABELS values */
const STATUS_CHIPS: Array<{ value: PurchaseOrderStatus | "all"; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "not_started", label: "Chưa bắt đầu" },
  { value: "in_progress", label: "Đang xử lý" },
  { value: "completed", label: "Hoàn thành" },
  { value: "unknown", label: "Không xác định" },
]

export interface PoListFilters {
  statuses: PurchaseOrderStatus[]
  supplierId: string
  fromDate: string
  toDate: string
}

interface PoListToolbarProps {
  filters: PoListFilters
  onFiltersChange: (filters: PoListFilters) => void
}

/** Toolbar with status chip multi-select, supplier dropdown, and date range inputs */
export function PoListToolbar({ filters, onFiltersChange }: PoListToolbarProps) {
  // Fetch up to 200 suppliers for dropdown
  const { data: suppliersPage } = useInventorySuppliers({ limit: 200 })
  const suppliers = suppliersPage?.data ?? []

  /** Toggle a status value in/out of the selected set */
  function toggleStatus(value: PurchaseOrderStatus | "all") {
    if (value === "all") {
      onFiltersChange({ ...filters, statuses: [] })
      return
    }
    const next = filters.statuses.includes(value)
      ? filters.statuses.filter((s) => s !== value)
      : [...filters.statuses, value]
    onFiltersChange({ ...filters, statuses: next })
  }

  function isStatusActive(value: PurchaseOrderStatus | "all"): boolean {
    if (value === "all") return filters.statuses.length === 0
    return filters.statuses.includes(value)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Status chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => toggleStatus(chip.value)}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
              isStatusActive(chip.value)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Row 2: Supplier select + date range */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Supplier dropdown */}
        <select
          value={filters.supplierId}
          onChange={(e) => onFiltersChange({ ...filters, supplierId: e.target.value })}
          className="h-10 rounded-[10px] border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-w-[180px]"
        >
          <option value="">Tất cả nhà cung cấp</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Date range: from */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap">Từ ngày</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => onFiltersChange({ ...filters, fromDate: e.target.value })}
            className="h-10 rounded-[10px] border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Date range: to */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap">Đến ngày</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => onFiltersChange({ ...filters, toDate: e.target.value })}
            className="h-10 rounded-[10px] border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Clear filters button — only shown when any filter active */}
        {(filters.statuses.length > 0 || filters.supplierId || filters.fromDate || filters.toDate) && (
          <button
            type="button"
            onClick={() =>
              onFiltersChange({ statuses: [], supplierId: "", fromDate: "", toDate: "" })
            }
            className="text-xs text-muted-foreground hover:text-primary underline"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AlertsFilters } from "../_hooks/use-alerts-list"

// ─── Chip options ─────────────────────────────────────────────────────────────

const SEVERITY_CHIPS = [
  { value: "", label: "Tất cả" },
  { value: "critical", label: "Nghiêm trọng" },
  { value: "warning", label: "Cảnh báo" },
  { value: "info", label: "Thông tin" },
]

const TYPE_CHIPS = [
  { value: "", label: "Tất cả" },
  { value: "stockout", label: "Hết hàng" },
  { value: "reorder", label: "Đặt hàng" },
  { value: "overstock", label: "Tồn dư" },
  { value: "anomaly", label: "Bất thường" },
  { value: "transfer", label: "Chuyển kho" },
]

const STATUS_CHIPS = [
  { value: "open", label: "Mở" },
  { value: "acknowledged", label: "Đã xác nhận" },
  { value: "resolved", label: "Đã xử lý" },
  { value: "", label: "Tất cả" },
]

// ─── Reusable chip button ─────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      {label}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AlertsFilterBarProps {
  filters: AlertsFilters
  onFilterChange: <K extends keyof AlertsFilters>(key: K, value: AlertsFilters[K]) => void
}

/**
 * Filter bar for alerts list:
 * - Debounced search input (debounce handled in hook, input is immediate)
 * - Severity single-select chips
 * - Type single-select chips
 * - Status single-select chips (default: open)
 * - Branch dropdown (plain select — no external branch API, uses branch_id filter)
 */
export function AlertsFilterBar({ filters, onFilterChange }: AlertsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[10px] border border-border bg-card p-4">
      {/* Row 1: Search */}
      <div className="relative max-w-xs">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Tìm theo SKU code..."
          value={filters.q}
          onChange={(e) => onFilterChange("q", e.target.value)}
          className="h-10 w-full rounded-[10px] border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Row 2: Severity chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">Mức độ:</span>
        {SEVERITY_CHIPS.map((chip) => (
          <Chip
            key={chip.value || "all-severity"}
            label={chip.label}
            active={filters.severity === chip.value}
            onClick={() => onFilterChange("severity", chip.value)}
          />
        ))}
      </div>

      {/* Row 3: Type chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">Loại:</span>
        {TYPE_CHIPS.map((chip) => (
          <Chip
            key={chip.value || "all-type"}
            label={chip.label}
            active={filters.alert_type === chip.value}
            onClick={() => onFilterChange("alert_type", chip.value)}
          />
        ))}
      </div>

      {/* Row 4: Status chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">Trạng thái:</span>
        {STATUS_CHIPS.map((chip) => (
          <Chip
            key={chip.value || "all-status"}
            label={chip.label}
            active={filters.status === chip.value}
            onClick={() => onFilterChange("status", chip.value)}
          />
        ))}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { ChevronDown, WarehouseIcon } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useWarehouses } from "@/hooks/use-warehouses"

interface SkuListStockFilterProps {
  selected: string[]
  onChange: (codes: string[]) => void
}

/** Multi-select warehouse filter — renders the selected-count on the trigger and a
 *  checklist of all AmisStock rows in the popover. Empty selection means "no filter". */
export function SkuListStockFilter({ selected, onChange }: SkuListStockFilterProps) {
  const { data: warehouses, isLoading } = useWarehouses()

  function toggle(code: string) {
    onChange(
      selected.includes(code)
        ? selected.filter((c) => c !== code)
        : [...selected, code],
    )
  }

  const triggerLabel =
    selected.length === 0
      ? "Tất cả kho"
      : selected.length === 1
      ? warehouses?.find((w) => w.stock_code === selected[0])?.stock_name ?? selected[0]
      : `${selected.length} kho đã chọn`

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex h-10 items-center justify-between gap-2 rounded-[10px] border border-border bg-white px-3 text-sm font-normal text-foreground outline-none transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20",
          selected.length > 0 && "border-primary",
        )}
        data-testid="sku-list-stock-filter-trigger"
      >
        <WarehouseIcon className="size-4 text-muted-foreground" />
        <span className="max-w-[160px] truncate">{triggerLabel}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Lọc theo kho</span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-medium text-primary hover:underline"
              data-testid="sku-list-stock-filter-clear"
            >
              Xoá
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto py-1">
          {isLoading && (
            <div className="px-3 py-2 text-xs text-muted-foreground">Đang tải…</div>
          )}
          {!isLoading &&
            warehouses?.map((w) => {
              const checked = selected.includes(w.stock_code)
              return (
                <label
                  key={w.stock_code}
                  className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-muted/40"
                  data-testid={`sku-list-stock-filter-option-${w.stock_code}`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(w.stock_code)}
                  />
                  <span className="flex flex-col">
                    <span className="text-sm text-foreground">
                      {w.stock_name ?? w.stock_code}
                    </span>
                    {w.stock_name && (
                      <span className="text-xs text-muted-foreground">{w.stock_code}</span>
                    )}
                  </span>
                </label>
              )
            })}
          {!isLoading && warehouses?.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground">Không có kho nào</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  /** Label for the item type shown in "Showing X-Y of Z {itemLabel}" */
  itemLabel?: string
  className?: string
}

// Simple prev/next pagination with "Showing X-Y of Z" label
function Pagination({ page, pageSize, total, onPageChange, itemLabel = "mục", className }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const isFirstPage = page <= 1
  const isLastPage = end >= total

  return (
    <div className={cn("flex items-center justify-between gap-4 py-3", className)}>
      {/* Count label */}
      <span className="text-sm text-[#71717A]">
        Hiển thị {start}-{end} / {total} {itemLabel}
      </span>

      {/* Navigation buttons — icon-only with border per design */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E4E4E7] text-[#71717A] hover:bg-[#F8FAFC] disabled:opacity-40"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage}
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E4E4E7] text-[#71717A] hover:bg-[#F8FAFC] disabled:opacity-40"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

export { Pagination }
export type { PaginationProps }

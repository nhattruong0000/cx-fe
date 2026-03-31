import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

// Simple prev/next pagination with "Showing X-Y of Z" label
function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const isFirstPage = page <= 1
  const isLastPage = end >= total

  return (
    <div className={cn("flex items-center justify-between gap-4 py-3", className)}>
      {/* Count label */}
      <span className="text-sm text-[#71717A]">
        Showing <span className="font-medium text-[#09090B]">{start}</span>
        {"-"}
        <span className="font-medium text-[#09090B]">{end}</span>
        {" of "}
        <span className="font-medium text-[#09090B]">{total}</span>
        {" items"}
      </span>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
          className="text-[#71717A] hover:text-[#09090B] disabled:opacity-40"
        >
          <ChevronLeftIcon className="size-4" />
          Previous
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage}
          aria-label="Next page"
          className="text-[#71717A] hover:text-[#09090B] disabled:opacity-40"
        >
          Next
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export { Pagination }
export type { PaginationProps }

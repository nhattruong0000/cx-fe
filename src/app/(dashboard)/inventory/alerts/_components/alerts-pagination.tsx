"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AlertListMeta } from "@/types/inventory"

interface AlertsPaginationProps {
  meta: AlertListMeta
  onPageChange: (page: number) => void
  isLoading?: boolean
}

/** Builds page numbers + ellipsis markers for display */
function visiblePages(total: number, current: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const result: (number | "ellipsis")[] = []
  const around = [current - 1, current, current + 1].filter((p) => p >= 1 && p <= total)
  const set = new Set([1, total, ...around])
  const sorted = [...set].sort((a, b) => a - b)
  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i])
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      result.push("ellipsis")
    }
  }
  return result
}

/** Offset-based pagination footer — page numbers + prev/next + result summary */
export function AlertsPagination({ meta, onPageChange, isLoading }: AlertsPaginationProps) {
  const { page, total_pages, total, per_page } = meta
  if (total_pages <= 1 && total === 0) return null

  const from = Math.min((page - 1) * per_page + 1, total)
  const to = Math.min(page * per_page, total)
  const pages = visiblePages(total_pages, page)

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-muted-foreground">
        Hiển thị {from}–{to} / {total} cảnh báo
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          aria-label="Trang trước"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeftIcon className="size-4" />
        </button>

        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`el-${i}`} className="px-2 text-sm text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={isLoading}
              aria-label={`Trang ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages || isLoading}
          aria-label="Trang sau"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, HelpCircle, Loader2Icon, Search } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSupplierSkus } from "@/hooks/use-supplier-skus"
import type { StockStatus, SupplierSkuItem } from "@/types/inventory"
import { supplierSkusColumns } from "./supplier-skus-columns"

const PAGE_LIMIT = 15

/** Status filter chip options */
const STATUS_CHIPS: { label: string; value: StockStatus | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Ổn định", value: "ok" },
  { label: "Cảnh báo", value: "warn" },
  { label: "Nguy cấp", value: "critical" },
]

interface SupplierSkusTableProps {
  supplierId: string
  /** Called when user clicks a SKU code row — passes full row for modal context */
  onRowClick: (row: SupplierSkuItem) => void
}

/**
 * Paginated SKU table for a specific supplier.
 * Uses page-based navigation (Prev/Next) backed by a keyset cursor stack —
 * BE pagination is cursor-based, but UX presents explicit page numbers.
 */
export function SupplierSkusTable({ supplierId, onRowClick }: SupplierSkusTableProps) {
  const [search, setSearch] = React.useState("")
  const [deferredSearch, setDeferredSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StockStatus | "all">("all")
  const [pageSize, setPageSize] = React.useState<number>(15)

  // cursorStack[i] is the cursor needed to fetch page index i (0-based).
  // Page 0 uses undefined cursor. When a new page's `next_cursor` arrives,
  // we push it so the user can navigate forward.
  const [cursorStack, setCursorStack] = React.useState<(string | undefined)[]>([undefined])
  const [pageIndex, setPageIndex] = React.useState(0)
  // Tracks highest page index ever visited — used to build numbered page buttons.
  const [maxPageReached, setMaxPageReached] = React.useState(0)
  // False when the last fetched page has no next_cursor and is the furthest known page.
  const [hasMorePages, setHasMorePages] = React.useState(true)

  // Reset pagination whenever search/filter changes
  const resetPagination = React.useCallback(() => {
    setCursorStack([undefined])
    setPageIndex(0)
    setMaxPageReached(0)
    setHasMorePages(true)
  }, [])

  // Debounce search — mount-safe
  React.useEffect(() => {
    if (search === deferredSearch) return
    const timer = setTimeout(() => {
      setDeferredSearch(search)
      resetPagination()
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // Reset on filter change
  React.useEffect(() => {
    resetPagination()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  // Reset on page size change
  React.useEffect(() => {
    resetPagination()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  const currentCursor = cursorStack[pageIndex]

  const queryParams = {
    limit: pageSize,
    ...(deferredSearch ? { q: deferredSearch } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    ...(currentCursor ? { cursor: currentCursor } : {}),
  }

  const { data, isLoading, isError, refetch } = useSupplierSkus(supplierId, queryParams)

  // When a new page lands, record its next_cursor onto the stack at pageIndex+1.
  // Idempotent — only extends if we haven't already recorded this page's next.
  React.useEffect(() => {
    if (!data) return
    setCursorStack((prev) => {
      const next = data.next_cursor ?? undefined
      if (prev.length > pageIndex + 1) return prev
      return [...prev, next]
    })
    setMaxPageReached((prev) => Math.max(prev, pageIndex))
    // If no next cursor and this is the furthest page we know about — no more pages.
    if (!data.next_cursor && pageIndex >= maxPageReached) {
      setHasMorePages(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageIndex])

  const rows = data?.data ?? []
  const nextCursor = cursorStack[pageIndex + 1]
  const hasNext = !!nextCursor
  const hasPrev = pageIndex > 0

  function goPrev() {
    if (!hasPrev) return
    setPageIndex((i) => i - 1)
  }

  function goNext() {
    if (!hasNext) return
    setPageIndex((i) => i + 1)
  }

  /** Builds the list of page numbers + ellipsis markers to render as buttons. */
  function visiblePages(pages: number[], current: number): (number | "ellipsis")[] {
    if (pages.length <= 7) return pages
    const result: (number | "ellipsis")[] = []
    const first = pages[0]
    const last = pages[pages.length - 1]
    const around = [current - 1, current, current + 1].filter((p) => p >= first && p <= last)
    const set = new Set<number>([first, last, ...around])
    const sorted = [...set].sort((a, b) => a - b)
    for (let i = 0; i < sorted.length; i++) {
      result.push(sorted[i])
      if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
        result.push("ellipsis")
      }
    }
    return result
  }

  const knownPages = Array.from({ length: maxPageReached + 1 }, (_, i) => i)

  // Table meta passes onRowClick down to column cells
  const tableMeta = React.useMemo(() => ({ onRowClick }), [onRowClick])

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Section title + tooltip */}
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Danh sách mặt hàng</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="text-muted-foreground hover:text-foreground"
                aria-label="Giải thích danh sách mặt hàng"
              >
                <HelpCircle className="size-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                Danh sách tất cả mặt hàng đã từng nhập từ nhà cung cấp này, kèm tồn kho hiện
                tại và dự báo nhu cầu 30/90 ngày.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Toolbar: search + status chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Tìm mã hàng hoặc tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 rounded-[10px] border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-1.5">
            {STATUS_CHIPS.map((chip) => (
              <button
                key={chip.value}
                type="button"
                onClick={() => setStatusFilter(chip.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === chip.value
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading — only when we have no data yet */}
        {isLoading && rows.length === 0 && (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            <Loader2Icon className="mr-2 size-4 animate-spin" />
            Đang tải mặt hàng...
          </div>
        )}

        {isError && rows.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-sm text-muted-foreground">
            <p>Không thể tải danh sách mặt hàng.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex h-9 items-center rounded-[10px] border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Data table */}
        {!isLoading || rows.length > 0 ? (
          <DataTable columns={supplierSkusColumns} data={rows} meta={tableMeta} />
        ) : null}

        {/* Pagination — always visible when table has data */}
        {(!isLoading || rows.length > 0) && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                Trang {pageIndex + 1}
                {isLoading && pageIndex > 0 ? " · đang tải..." : ""}
              </p>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Hiển thị</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-9 rounded-[10px] border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {[15, 30, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span>dòng/trang</span>
              </label>
            </div>
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                type="button"
                onClick={goPrev}
                disabled={!hasPrev || isLoading}
                aria-label="Trang trước"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>

              {/* Numbered page buttons */}
              {visiblePages(knownPages, pageIndex).map((p, i) =>
                p === "ellipsis" ? (
                  <span key={`el-${i}`} className="px-2 text-sm text-muted-foreground">...</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPageIndex(p)}
                    disabled={isLoading}
                    aria-label={`Trang ${p + 1}`}
                    aria-current={p === pageIndex ? "page" : undefined}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      p === pageIndex
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {p + 1}
                  </button>
                )
              )}

              {/* Trailing ellipsis when more pages may exist beyond known range */}
              {hasMorePages && knownPages.length > 0 && (
                <span className="px-2 text-sm text-muted-foreground">...</span>
              )}

              {/* Next */}
              <button
                type="button"
                onClick={goNext}
                disabled={!hasNext || isLoading}
                aria-label="Trang sau"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

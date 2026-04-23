"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { useInventoryPurchaseOrders } from "@/hooks/use-inventory-purchase-orders"
import type { PurchaseOrderListItem, PurchaseOrdersListParams, PurchaseOrderSortField, SortOrder } from "@/types/inventory"
import type { PoListFilters } from "./po-list-toolbar"
import { poListColumns } from "./po-list-columns"

const PAGE_LIMIT = 15

interface PoListTableProps {
  filters: PoListFilters
}

/**
 * PO list table with page-based pagination (Prev / Trang X / Next).
 * Backed by a keyset cursor stack — BE is cursor-based, UX shows explicit page numbers.
 * Manages its own pagination state; resets when `filters` prop changes.
 */
/** Sort config labels */
const SORT_LABELS: Record<PurchaseOrderSortField, string> = {
  created_at: "Ngày tạo",
  total_amount: "Tổng tiền",
}

/** Sort rows client-side (fallback when BE sort param is not supported) */
function sortRows(
  rows: PurchaseOrderListItem[],
  field: PurchaseOrderSortField,
  order: SortOrder
): PurchaseOrderListItem[] {
  return [...rows].sort((a, b) => {
    let aVal: number, bVal: number
    if (field === "created_at") {
      aVal = new Date(a.created_at).getTime()
      bVal = new Date(b.created_at).getTime()
    } else {
      aVal = Number(a.total_amount)
      bVal = Number(b.total_amount)
    }
    return order === "desc" ? bVal - aVal : aVal - bVal
  })
}

export function PoListTable({ filters }: PoListTableProps) {
  const [pageSize, setPageSize] = React.useState<number>(15)
  // Default sort: created_at desc (most recent PO first)
  const [sortField, setSortField] = React.useState<PurchaseOrderSortField>("created_at")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc")

  // cursorStack[i] is the cursor needed to fetch page index i (0-based).
  // Page 0 uses undefined cursor. next_cursor from each page stored at index i+1.
  const [cursorStack, setCursorStack] = React.useState<(string | undefined)[]>([undefined])
  const [pageIndex, setPageIndex] = React.useState(0)
  // Tracks highest page index ever visited — used to build numbered page buttons.
  const [maxPageReached, setMaxPageReached] = React.useState(0)
  // False when the last fetched page has no next_cursor and is the furthest known page.
  const [hasMorePages, setHasMorePages] = React.useState(true)

  const filtersKey = JSON.stringify(filters)
  const prevFiltersKeyRef = React.useRef(filtersKey)

  // Reset pagination when filters change
  const resetPagination = React.useCallback(() => {
    setCursorStack([undefined])
    setPageIndex(0)
    setMaxPageReached(0)
    setHasMorePages(true)
  }, [])

  React.useEffect(() => {
    if (prevFiltersKeyRef.current !== filtersKey) {
      prevFiltersKeyRef.current = filtersKey
      resetPagination()
    }
  }, [filtersKey, resetPagination])

  // Reset on page size change
  React.useEffect(() => {
    resetPagination()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  const currentCursor = cursorStack[pageIndex]

  // Build query params from filters + current cursor
  const queryParams = React.useMemo<PurchaseOrdersListParams>(() => {
    const p: Record<string, unknown> = { limit: pageSize }
    if (filters.statuses.length > 0) p.status = filters.statuses.join(",")
    if (filters.supplierId) p.supplier_id = filters.supplierId
    if (filters.fromDate) p.from_date = filters.fromDate
    if (filters.toDate) p.to_date = filters.toDate
    if (currentCursor) p.cursor = currentCursor
    return p as PurchaseOrdersListParams
  }, [filters, currentCursor, pageSize])

  const { data, isLoading, error } = useInventoryPurchaseOrders(queryParams)

  // When a new page lands, record its next_cursor onto the stack at pageIndex+1 (idempotent).
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

  const rawRows = data?.data ?? []
  // Client-side sort applied to current page (cursor pagination doesn't guarantee order)
  const rows = sortRows(rawRows, sortField, sortOrder)
  const hasNext = !!cursorStack[pageIndex + 1]
  const hasPrev = pageIndex > 0

  function goPrev() {
    if (!hasPrev) return
    setPageIndex((i) => i - 1)
  }

  function goNext() {
    if (!hasNext) return
    setPageIndex((i) => i + 1)
  }

  /** Toggle sort: same field → flip order; new field → default desc */
  function handleSortChange(field: PurchaseOrderSortField) {
    if (field === sortField) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"))
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
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

  if (isLoading && rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        Đang tải...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Error banner */}
      {error && !isLoading && (
        <div className="rounded-[10px] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Không thể tải danh sách đơn hàng. Vui lòng thử lại.
        </div>
      )}

      {/* Sort controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Sắp xếp theo:</span>
        {(Object.keys(SORT_LABELS) as PurchaseOrderSortField[]).map((field) => {
          const isActive = sortField === field
          const SortIcon = isActive && sortOrder === "asc" ? ChevronUp : ChevronDown
          return (
            <button
              key={field}
              type="button"
              onClick={() => handleSortChange(field)}
              className={`inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {SORT_LABELS[field]}
              <SortIcon className="size-3" />
            </button>
          )
        })}
      </div>

      <DataTable columns={poListColumns} data={rows} />

      {/* Pagination — always visible when data present */}
      {rows.length > 0 && (
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
                className="h-9 rounded-[10px] border border-border bg-white px-2 text-sm text-foreground outline-none focus:border-primary"
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-white text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
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
                      : "border border-border bg-white text-foreground hover:bg-muted"
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-white text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, PackageIcon } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { useInventoryStockList } from "@/hooks/use-inventory-stock-list"
import type { StockListItem, StockListParams } from "@/types/inventory"
import { skuListColumns } from "./sku-list-columns"
import { SkuEvidenceDrawer } from "./sku-evidence-drawer"
import { InventoryEmptyState } from "./inventory-empty-state"

// ─── Sort types ───────────────────────────────────────────────────────────────

type SkuSortField = "sku_code" | "on_hand" | "updated_at"
type SortOrder = "asc" | "desc"

const SKU_SORT_LABELS: Record<SkuSortField, string> = {
  sku_code: "Mã SKU",
  on_hand: "Tồn kho",
  updated_at: "Đồng bộ",
}

/** Client-side sort on the current fetched page */
function sortSkuRows(rows: StockListItem[], field: SkuSortField, order: SortOrder): StockListItem[] {
  return [...rows].sort((a, b) => {
    let aVal: string | number, bVal: string | number
    if (field === "sku_code") {
      aVal = a.sku_code
      bVal = b.sku_code
    } else if (field === "on_hand") {
      aVal = a.on_hand
      bVal = b.on_hand
    } else {
      aVal = new Date(a.updated_at).getTime()
      bVal = new Date(b.updated_at).getTime()
    }
    if (typeof aVal === "string") {
      return order === "asc"
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal)
    }
    return order === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  })
}

/** Shimmer skeleton row for loading state */
function TableSkeleton() {
  return (
    <div className="w-full overflow-x-auto rounded-[10px] border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-primary/5">
            {["SKU", "Tên", "Tồn", "Đặt", "Có sẵn", "Trạng thái", "Cập nhật"].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[13px] font-semibold text-muted-foreground"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 7 }).map((_, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              {Array.from({ length: 7 }).map((__, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 animate-pulse rounded bg-muted" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface SkuListTableProps {
  params: StockListParams
}

/**
 * SKU inventory list table with page-based pagination (Prev / Trang X / Next).
 * Backed by a keyset cursor stack — BE is cursor-based, UX shows explicit page numbers.
 */
export function SkuListTable({ params }: SkuListTableProps) {
  // Drawer state — null = closed, string = open for that SKU code
  const [openCode, setOpenCode] = React.useState<string | null>(null)
  const [pageSize, setPageSize] = React.useState<number>(15)
  // Client-side sort (default: on_hand desc to surface critical stock first)
  const [sortField, setSortField] = React.useState<SkuSortField>("on_hand")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc")

  // cursorStack[i] is the cursor needed to fetch page index i (0-based).
  // Page 0 uses undefined cursor. next_cursor from each page is stored at index i+1.
  const [cursorStack, setCursorStack] = React.useState<(string | undefined)[]>([undefined])
  const [pageIndex, setPageIndex] = React.useState(0)
  // Tracks highest page index ever visited — used to build numbered page buttons.
  const [maxPageReached, setMaxPageReached] = React.useState(0)
  // False when the last fetched page has no next_cursor and is the furthest known page.
  const [hasMorePages, setHasMorePages] = React.useState(true)

  const paramsKey = JSON.stringify(params)
  const prevParamsKeyRef = React.useRef<string>(paramsKey)

  // Reset pagination whenever search/filter params change
  const resetPagination = React.useCallback(() => {
    setCursorStack([undefined])
    setPageIndex(0)
    setMaxPageReached(0)
    setHasMorePages(true)
  }, [])

  React.useEffect(() => {
    if (prevParamsKeyRef.current !== paramsKey) {
      prevParamsKeyRef.current = paramsKey
      resetPagination()
    }
  }, [paramsKey, resetPagination])

  // Reset on page size change
  React.useEffect(() => {
    resetPagination()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  const currentCursor = cursorStack[pageIndex]

  const queryParams: StockListParams = {
    ...params,
    limit: pageSize,
    ...(currentCursor ? { cursor: currentCursor } : {}),
  }

  const { data, isLoading, isError, refetch } = useInventoryStockList(queryParams)

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
  // Apply client-side sort on current page
  const rows = sortSkuRows(rawRows, sortField, sortOrder)
  const hasNext = !!cursorStack[pageIndex + 1]
  const hasPrev = pageIndex > 0

  /** Toggle sort: same field flips order; new field defaults to desc */
  function handleSortChange(field: SkuSortField) {
    if (field === sortField) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"))
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

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

  if (isLoading && rows.length === 0) return <TableSkeleton />

  if (isError && rawRows.length === 0) {
    return (
      <InventoryEmptyState
        icon={PackageIcon}
        title="Không thể tải dữ liệu tồn kho"
        description="Đã xảy ra lỗi khi tải danh sách SKU. Vui lòng thử lại."
        action={{ label: "Thử lại", onClick: () => void refetch() }}
      />
    )
  }

  // Empty state — query succeeded but no results
  if (!isLoading && rawRows.length === 0) {
    return (
      <InventoryEmptyState
        icon={PackageIcon}
        title="Chưa có dữ liệu tồn kho"
        description="Dữ liệu tồn kho sẽ xuất hiện sau khi đồng bộ từ AMIS."
        action={{ label: "Đồng bộ AMIS", onClick: () => window.location.reload() }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Sort controls — same pattern as PO list */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Sắp xếp theo:</span>
        {(Object.keys(SKU_SORT_LABELS) as SkuSortField[]).map((field) => {
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
              {SKU_SORT_LABELS[field]}
              <SortIcon className="size-3" />
            </button>
          )
        })}
      </div>

      <DataTable
        columns={skuListColumns}
        data={rows}
        onRowClick={(row) => setOpenCode(row.sku_code)}
        getRowTestId={(row) => `sku-row-${row.sku_code}`}
        getRowDataAttrs={(row) => ({ 'data-sku-code': row.sku_code })}
      />

      {/* SKU evidence drawer — opened on row click */}
      <SkuEvidenceDrawer
        code={openCode}
        open={!!openCode}
        onOpenChange={(o) => { if (!o) setOpenCode(null) }}
      />

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

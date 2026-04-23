"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

import type { StockListParams, StockStatus } from "@/types/inventory"
import { SkuListToolbar } from "./_components/sku-list-toolbar"
import { SkuListTable } from "./_components/sku-list-table"

const PAGE_LIMIT = 50

/**
 * Inner component that reads useSearchParams — must be wrapped in Suspense
 * per Next.js App Router requirement to avoid prerender bail-out.
 */
function InventoryPageInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = React.useState("")
  const [deferredSearch, setDeferredSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StockStatus | "all">("all")
  const [stockCodes, setStockCodes] = React.useState<string[]>([])

  // Paused toggle — persisted in URL query string (?include_paused=true)
  const includePaused = searchParams.get("include_paused") === "true"

  function handleIncludePausedChange(next: boolean) {
    const qs = new URLSearchParams(searchParams.toString())
    if (next) {
      qs.set("include_paused", "true")
    } else {
      qs.delete("include_paused")
    }
    const newUrl = qs.toString() ? `${pathname}?${qs.toString()}` : pathname
    router.replace(newUrl)
  }

  // Debounce search 300 ms
  React.useEffect(() => {
    const timer = setTimeout(() => setDeferredSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const params: StockListParams = {
    limit: PAGE_LIMIT,
    ...(deferredSearch ? { q: deferredSearch } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    ...(stockCodes.length > 0 ? { stock_codes: stockCodes.join(",") } : {}),
    ...(includePaused ? { include_paused: true } : {}),
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tồn kho theo SKU</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Danh sách tồn kho theo mã SKU — tìm kiếm, lọc theo trạng thái và tải thêm.
        </p>
      </div>

      {/* Toolbar: search + stock filter + status chips + paused toggle */}
      <SkuListToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stockCodes={stockCodes}
        onStockCodesChange={setStockCodes}
        includePaused={includePaused}
        onIncludePausedChange={handleIncludePausedChange}
      />

      {/* Data table with cursor pagination */}
      <div data-testid="inventory-list">
        <SkuListTable params={params} />
      </div>
    </div>
  )
}

/** /inventory — SKU stock list page. Suspense wraps the inner component to satisfy
 *  Next.js App Router requirement for useSearchParams usage. */
export default function InventoryPage() {
  return (
    <React.Suspense fallback={null}>
      <InventoryPageInner />
    </React.Suspense>
  )
}

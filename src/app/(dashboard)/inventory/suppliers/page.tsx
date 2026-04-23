"use client"

import * as React from "react"

import { SuppliersListToolbar } from "./_components/suppliers-list-toolbar"
import { SuppliersListTable } from "./_components/suppliers-list-table"

/** /inventory/suppliers — supplier list with search and page-based pagination */
export default function InventorySuppliersPage() {
  const [search, setSearch] = React.useState("")
  const [deferredSearch, setDeferredSearch] = React.useState("")

  // Debounce search 300 ms before passing to table
  React.useEffect(() => {
    if (search === deferredSearch) return
    const timer = setTimeout(() => setDeferredSearch(search), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Nhà cung cấp</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Danh sách nhà cung cấp và lịch sử đặt hàng.
        </p>
      </div>

      {/* Search toolbar */}
      <SuppliersListToolbar search={search} onSearchChange={setSearch} />

      {/* Data table with page-based pagination */}
      <SuppliersListTable search={deferredSearch} />
    </div>
  )
}

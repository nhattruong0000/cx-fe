"use client"

import * as React from "react"
import { PoListToolbar, type PoListFilters } from "./_components/po-list-toolbar"
import { PoListTable } from "./_components/po-list-table"

const EMPTY_FILTERS: PoListFilters = {
  statuses: [],
  supplierId: "",
  fromDate: "",
  toDate: "",
}

/** /purchase-orders — cursor-paginated PO list with status/supplier/date filters */
export default function PurchaseOrdersPage() {
  const [filters, setFilters] = React.useState<PoListFilters>(EMPTY_FILTERS)

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Đơn nhập hàng (PO)</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý các đơn đặt hàng nhập kho.
        </p>
      </div>

      {/* Filters toolbar */}
      <PoListToolbar filters={filters} onFiltersChange={setFilters} />

      {/* Data table with page-based pagination */}
      <PoListTable filters={filters} />
    </div>
  )
}

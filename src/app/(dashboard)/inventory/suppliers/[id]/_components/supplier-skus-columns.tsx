"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatRelativeTime } from "@/lib/format-relative-time"
import type { SupplierSkuItem } from "@/types/inventory"
// Reuse shared status badge — do NOT duplicate
import { SkuStatusBadge } from "../../../_components/sku-status-badge"

/** Column definitions for the supplier SKUs table */
export const supplierSkusColumns: ColumnDef<SupplierSkuItem>[] = [
  {
    accessorKey: "sku_code",
    header: "Mã hàng",
    cell: ({ row, table }) => {
      // onRowClick receives full row so parent can pass context to forecast modal
      const meta = table.options.meta as { onRowClick?: (row: SupplierSkuItem) => void } | undefined
      return (
        <button
          type="button"
          onClick={() => meta?.onRowClick?.(row.original)}
          className="font-mono text-sm text-blue-600 hover:underline"
        >
          {row.original.sku_code}
        </button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => (
      <span
        className="block max-w-[200px] truncate"
        title={row.original.name}
      >
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "on_hand",
    header: () => <span className="block text-right">Tồn kho</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums">
        {row.original.on_hand.toLocaleString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Tình trạng",
    cell: ({ row }) => <SkuStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "forecast_30d",
    header: () => <span className="block text-right">Nhu cầu 30 ngày</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums text-muted-foreground">
        {row.original.forecast_30d != null
          ? row.original.forecast_30d.toLocaleString("vi-VN")
          : "—"}
      </span>
    ),
  },
  {
    accessorKey: "forecast_90d",
    header: () => <span className="block text-right">Nhu cầu 90 ngày</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums text-muted-foreground">
        {row.original.forecast_90d != null
          ? row.original.forecast_90d.toLocaleString("vi-VN")
          : "—"}
      </span>
    ),
  },
  {
    accessorKey: "updated_at",
    header: "Cập nhật",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatRelativeTime(row.original.updated_at)}
      </span>
    ),
  },
]

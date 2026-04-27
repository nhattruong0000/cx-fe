"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatRelativeTime } from "@/lib/format-relative-time"
import type { SupplierSkuItem } from "@/types/inventory"
// Reuse shared status badge — do NOT duplicate
import { SkuStatusBadge } from "../../../_components/sku-status-badge"

// ─── DUS color band helper ────────────────────────────────────────────────────

/** Returns a Tailwind color class for DUS value: red <7, yellow 7-14, green ≥14 */
function dusBadgeClass(dus: number | null): string {
  if (dus === null) return "text-muted-foreground"
  if (dus < 7) return "font-semibold text-red-600"
  if (dus < 14) return "font-semibold text-yellow-600"
  return "font-semibold text-green-600"
}

function fmtNum(v: number | null, digits = 1): string {
  if (v === null) return "—"
  return v.toLocaleString("vi-VN", { maximumFractionDigits: digits })
}

/** Column definitions for the supplier SKUs table (V2 fields: daily_rate/rop/classification/dus) */
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
    accessorKey: "daily_rate",
    header: () => <span className="block text-right">Tiêu thụ/ngày</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums text-muted-foreground">
        {fmtNum(row.original.daily_rate)} đv/ngày
      </span>
    ),
  },
  {
    accessorKey: "rop",
    header: () => <span className="block text-right">ROP</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums text-muted-foreground">
        {fmtNum(row.original.rop, 0)}
      </span>
    ),
  },
  {
    accessorKey: "classification",
    header: "Phân loại",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.classification ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "dus",
    header: () => <span className="block text-right">DUS (ngày)</span>,
    cell: ({ row }) => (
      <span className={`block text-right tabular-nums ${dusBadgeClass(row.original.dus)}`}>
        {row.original.dus !== null ? fmtNum(row.original.dus, 1) : "—"}
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

"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { PurchaseOrderListItem } from "@/types/inventory"
import { PoStatusBadge } from "./po-status-badge"

/** Format ISO date string to Vietnamese locale date (DD/MM/YYYY) */
function formatDate(iso: string | null): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return "—"
  }
}

/**
 * Format amount with currency code. Accepts string or number — BE may return
 * decimal strings like "10224000.0". Guards against NaN/Infinity.
 */
function formatCurrency(amount: string | number, currency: string): string {
  const value = Number(amount)
  if (!Number.isFinite(value)) return "—"
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    // Fallback for unknown currency codes
    return `${value.toLocaleString("vi-VN")} ${currency}`
  }
}

/** Column definitions for the PO list table.
 *  Note: expected_delivery_date is omitted — BE always returns null (deferred field).
 */
export const poListColumns: ColumnDef<PurchaseOrderListItem>[] = [
  {
    accessorKey: "po_no",
    header: "Mã PO",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold text-foreground">
        {row.original.po_no}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>
    ),
  },
  {
    accessorKey: "supplier",
    header: "Nhà cung cấp",
    cell: ({ row }) => (
      <span
        className="block max-w-[200px] truncate"
        title={row.original.supplier.name}
      >
        {row.original.supplier.name}
      </span>
    ),
  },
  {
    accessorKey: "total_amount",
    header: () => <span className="block text-right">Tổng tiền</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums">
        {formatCurrency(row.original.total_amount, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <PoStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "lines_count",
    header: () => <span className="block text-right">Số dòng</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums text-muted-foreground">
        {row.original.lines_count}
      </span>
    ),
  },
]

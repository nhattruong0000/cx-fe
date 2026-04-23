"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"

import { formatRelativeTime } from "@/lib/format-relative-time"
import type { StockListItem } from "@/types/inventory"
import { SkuStatusBadge } from "./sku-status-badge"

/** Column definitions for the SKU inventory list table */
export const skuListColumns: ColumnDef<StockListItem>[] = [
  {
    accessorKey: "sku_code",
    header: "SKU",
    cell: ({ row }) => (
      <Link
        href={`/inventory/sku/${encodeURIComponent(row.original.sku_code)}`}
        className="font-mono text-sm text-primary hover:underline"
      >
        {row.original.sku_code}
      </Link>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => (
      <span className="block max-w-[220px] truncate" title={row.original.name}>
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "on_hand",
    header: () => <span className="block text-right">Tồn</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums">
        {row.original.on_hand.toLocaleString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "reserved",
    header: () => <span className="block text-right">Đặt</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums text-muted-foreground">
        {row.original.reserved.toLocaleString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "available",
    header: () => <span className="block text-right">Có sẵn</span>,
    cell: ({ row }) => (
      <span className="block text-right font-semibold tabular-nums">
        {row.original.available.toLocaleString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <SkuStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "updated_at",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Đồng bộ
        {/* Tooltip explaining batch-sync timestamp semantics */}
        <span
          title="Lần đồng bộ dữ liệu kho gần nhất từ hệ thống AMIS"
          className="inline-flex size-4 cursor-default items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground leading-none select-none"
          aria-label="Lần đồng bộ dữ liệu kho gần nhất từ hệ thống AMIS"
        >
          ⓘ
        </span>
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatRelativeTime(row.original.updated_at)}</span>
    ),
  },
]


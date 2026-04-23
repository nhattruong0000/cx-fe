"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { InfoIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { SupplierListItem } from "@/types/inventory"

/** Formats a date string as dd/mm/yyyy (vi-VN locale), or returns "—" for null */
function formatDate(value: string | null): string {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/** Renders p50/p90 lead time pair, or "—" when both are null */
function renderLeadTime(
  p50: number | null,
  p90: number | null,
): string {
  if (p50 == null && p90 == null) return "—"
  const p50s = p50 != null ? `${p50}` : "?"
  const p90s = p90 != null ? `${p90}` : "?"
  return `${p50s} / ${p90s} ngày`
}

/** Column definitions for the suppliers list table */
export const suppliersListColumns: ColumnDef<SupplierListItem>[] = [
  {
    accessorKey: "code",
    header: "Mã",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-foreground">{row.original.code}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => (
      <Link
        href={`/inventory/suppliers/${row.original.id}`}
        className="block max-w-[220px] truncate font-semibold text-primary hover:underline"
        title={row.original.name}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    id: "contact",
    header: "Liên hệ",
    cell: ({ row }) => {
      const { contact_email, contact_phone } = row.original
      if (!contact_email && !contact_phone) {
        return <span className="text-muted-foreground">—</span>
      }
      return (
        <div className="flex flex-col gap-0.5 text-sm">
          {contact_email && (
            <span className="text-foreground">{contact_email}</span>
          )}
          {contact_phone && (
            <span className="text-muted-foreground">{contact_phone}</span>
          )}
        </div>
      )
    },
  },
  {
    id: "lead_time",
    header: () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="inline-flex cursor-default items-center gap-1 bg-transparent p-0 text-inherit">
            Lead time (p50/p90)
            <InfoIcon className="size-3 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="top">
            p50 = trung vị lead time · p90 = 90% đơn hàng có lead time ≤ giá trị này
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-sm text-foreground">
        {renderLeadTime(row.original.lead_time_p50_days, row.original.lead_time_p90_days)}
      </span>
    ),
  },
  {
    accessorKey: "po_count_90d",
    header: () => <span className="block text-right">PO 90 ngày</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums">
        {row.original.po_count_90d.toLocaleString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "last_po_date",
    header: "PO gần nhất",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatDate(row.original.last_po_date)}</span>
    ),
  },
]

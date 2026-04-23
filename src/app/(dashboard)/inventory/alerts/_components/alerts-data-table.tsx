"use client"

import * as React from "react"
import { CheckCircle2Icon } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { cn } from "@/lib/utils"
import type { InventoryAlert, AlertSeverity } from "@/types/inventory"

// BE may serialize numerics as string (BigDecimal/numeric) — coerce safely
function toNum(v: unknown): number | null {
  if (v == null) return null
  const n = typeof v === "number" ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

// ─── Severity badge ───────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<AlertSeverity, { label: string; className: string }> = {
  critical: {
    label: "Nghiêm trọng",
    className: "bg-destructive/10 text-destructive",
  },
  warning: {
    label: "Cảnh báo",
    className: "bg-warning/10 text-warning",
  },
  info: {
    label: "Thông tin",
    className: "bg-info/10 text-info",
  },
}

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.info
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
      )}
    >
      {cfg.label}
    </span>
  )
}

// ─── Type badge ───────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  stockout: "Hết hàng",
  reorder: "Đặt hàng",
  overstock: "Tồn dư",
  anomaly: "Bất thường",
  transfer: "Chuyển kho",
}

function TypeBadge({ alertType }: { alertType: string }) {
  const label = TYPE_LABELS[alertType] ?? alertType
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {label}
    </span>
  )
}

// ─── Column definitions ───────────────────────────────────────────────────────

/** Build columns — acknowledge callback injected via meta */
export const alertsColumns: ColumnDef<InventoryAlert>[] = [
  {
    accessorKey: "sku_code",
    header: "SKU",
    cell: ({ row }) => {
      const code = row.original.sku_code ?? row.original.item_code
      return (
        <span className="font-mono text-sm text-primary">
          {code}
        </span>
      )
    },
  },
  {
    accessorKey: "sku_name",
    header: "Tên SP",
    cell: ({ row }) => {
      const name = row.original.sku_name ?? "—"
      return (
        <span className="block max-w-[180px] truncate text-sm" title={name}>
          {name}
        </span>
      )
    },
  },
  {
    accessorKey: "branch_name",
    header: "Chi nhánh",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.branch_name ?? row.original.branch_id}
      </span>
    ),
  },
  {
    accessorKey: "alert_type",
    header: "Loại",
    cell: ({ row }) => <TypeBadge alertType={row.original.alert_type} />,
  },
  {
    accessorKey: "severity",
    header: "Mức độ",
    cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
  },
  {
    accessorKey: "days_of_supply",
    header: () => <span className="block text-right">DOS</span>,
    cell: ({ row }) => {
      const n = toNum(row.original.days_of_supply)
      return <span className="block text-right tabular-nums text-sm">{n != null ? n.toFixed(1) : "—"}</span>
    },
  },
  {
    accessorKey: "on_hand",
    header: () => <span className="block text-right">Tồn kho</span>,
    cell: ({ row }) => {
      const n = toNum(row.original.on_hand)
      return <span className="block text-right tabular-nums text-sm">{n != null ? n.toLocaleString("vi-VN") : "—"}</span>
    },
  },
  {
    accessorKey: "reorder_point",
    header: () => <span className="block text-right">Điểm đặt</span>,
    cell: ({ row }) => {
      const n = toNum(row.original.reorder_point)
      return <span className="block text-right tabular-nums text-sm text-muted-foreground">{n != null ? n.toLocaleString("vi-VN") : "—"}</span>
    },
  },
  {
    accessorKey: "created_at",
    header: "Tạo lúc",
    cell: ({ row }) => {
      const d = new Date(row.original.created_at)
      return (
        <span className="text-xs text-muted-foreground">
          {d.toLocaleDateString("vi-VN")}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const alert = row.original
      const isOpen = alert.status === "open"
      // acknowledge callback injected via table meta
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onAcknowledge = (table.options.meta as any)?.onAcknowledge as
        | ((id: string) => void)
        | undefined

      if (!isOpen) {
        return (
          <span className="text-xs text-muted-foreground">
            {alert.status === "acknowledged" ? "Đã xác nhận" : "Đã xử lý"}
          </span>
        )
      }

      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onAcknowledge?.(alert.id)
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2Icon className="size-3.5" />
          Xác nhận
        </button>
      )
    },
  },
]

// ─── Empty state ──────────────────────────────────────────────────────────────

function AlertsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <CheckCircle2Icon className="size-12 text-success" />
      <p className="text-sm font-medium text-foreground">Không có cảnh báo nào</p>
      <p className="text-xs text-muted-foreground">
        Tất cả SKU đang trong ngưỡng an toàn
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AlertsDataTableProps {
  data: InventoryAlert[]
  isLoading: boolean
  onAcknowledge: (id: string) => void
}

/** Alerts data table — columns + empty state + loading skeleton rows */
export function AlertsDataTable({ data, isLoading, onAcknowledge }: AlertsDataTableProps) {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto rounded-[10px] border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["SKU", "Tên SP", "Chi nhánh", "Loại", "Mức độ", "DOS", "Tồn kho", "Điểm đặt", "Tạo lúc", ""].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left text-[13px] font-semibold text-muted-foreground">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-border last:border-b-0">
                {Array.from({ length: 10 }).map((__, j) => (
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

  if (data.length === 0) {
    return (
      <div className="rounded-[10px] border border-border bg-card">
        <AlertsEmptyState />
      </div>
    )
  }

  return (
    <DataTable
      columns={alertsColumns}
      data={data}
      meta={{ onAcknowledge }}
    />
  )
}

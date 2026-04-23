"use client"

import { Mail, Phone, MapPin, CalendarDays, Clock, RefreshCw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { SupplierDetail, SupplierStatus } from "@/types/inventory"

/** Maps supplier status to Vietnamese label and badge variant */
const STATUS_CONFIG: Record<
  SupplierStatus,
  { label: string; variant: "success" | "warning" }
> = {
  active: { label: "Đang hoạt động", variant: "success" },
  paused: { label: "Tạm ngưng", variant: "warning" },
}

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
function renderLeadTime(p50: number | null, p90: number | null): string {
  if (p50 == null && p90 == null) return "—"
  const p50s = p50 != null ? `${p50}` : "?"
  const p90s = p90 != null ? `${p90}` : "?"
  return `${p50s}/${p90s} ngày`
}

interface SupplierHeaderCardProps {
  detail: SupplierDetail
}

/** Header card: code + name + status badge + contact info + meta chips */
export function SupplierHeaderCard({ detail }: SupplierHeaderCardProps) {
  const statusConfig = STATUS_CONFIG[detail.status] ?? {
    label: detail.status,
    variant: "outline" as const,
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        {/* Title row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-lg font-semibold text-muted-foreground">
            {detail.code}
          </span>
          <span className="text-2xl font-bold text-foreground">{detail.name}</span>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>

        {/* Contact grid — 2 cols */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {/* Email */}
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            {detail.contact_email ? (
              <a
                href={`mailto:${detail.contact_email}`}
                className="text-blue-600 hover:underline"
              >
                {detail.contact_email}
              </a>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            {detail.contact_phone ? (
              <a href={`tel:${detail.contact_phone}`} className="text-foreground">
                {detail.contact_phone}
              </a>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>

          {/* Address — full row */}
          <div className="flex items-start gap-2 text-sm sm:col-span-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className={detail.address ? "text-foreground" : "text-muted-foreground"}>
              {detail.address ?? "—"}
            </span>
          </div>
        </div>

        {/* Meta chips row */}
        <div className="flex flex-wrap gap-4 border-t border-border pt-4 text-sm">
          {/* Last PO */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" />
            <span className="font-medium">Đơn gần nhất:</span>
            <span className="text-foreground">{formatDate(detail.last_po_date)}</span>
          </div>

          {/* Lead time */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-4 shrink-0" />
            <span className="font-medium">Thời gian chờ giao:</span>
            <span className="text-foreground">
              {renderLeadTime(detail.lead_time_p50_days, detail.lead_time_p90_days)}
            </span>
          </div>

          {/* Cadence */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <RefreshCw className="size-4 shrink-0" />
            <span className="font-medium">Tần suất đặt hàng:</span>
            <span className="text-foreground">
              {detail.cadence_days != null ? `${detail.cadence_days} ngày` : "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

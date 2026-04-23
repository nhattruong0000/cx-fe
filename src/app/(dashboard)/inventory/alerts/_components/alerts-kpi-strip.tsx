"use client"

import type { AlertListMeta } from "@/types/inventory"

interface KpiCardProps {
  label: string
  value: number | undefined
  colorClass: string
}

function KpiCard({ label, value, colorClass }: KpiCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-[10px] border border-border bg-card p-4">
      <span className={`text-2xl font-semibold tabular-nums ${colorClass}`}>
        {value ?? 0}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

interface AlertsKpiStripProps {
  meta: AlertListMeta | undefined
  isLoading: boolean
}

/**
 * 4-card KPI strip: Total open / Critical / Warning / Info.
 * Values read from meta.counts provided by BE. Falls back to 0 when loading.
 */
export function AlertsKpiStrip({ meta, isLoading }: AlertsKpiStripProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col gap-2 rounded-[10px] border border-border bg-card p-4"
          >
            <div className="h-7 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <KpiCard
        label="Tổng cảnh báo mở"
        value={meta?.counts?.open ?? meta?.total}
        colorClass="text-foreground"
      />
      <KpiCard
        label="Nghiêm trọng"
        value={meta?.counts?.critical}
        colorClass="text-destructive"
      />
      <KpiCard
        label="Cảnh báo"
        value={meta?.counts?.warning}
        colorClass="text-warning"
      />
      <KpiCard
        label="Thông tin"
        value={meta?.counts?.info}
        colorClass="text-info"
      />
    </div>
  )
}

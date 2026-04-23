"use client"

import { HelpCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { SupplierMetrics } from "@/types/inventory"

/** Formats number as Vietnamese currency (₫) */
function formatCurrency(value: number | null): string {
  if (value == null) return "—"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

interface MetricCardProps {
  label: string
  value: string
  tooltip: string
  subline?: string
}

/** Single KPI metric card with help tooltip */
function MetricCard({ label, value, tooltip, subline }: MetricCardProps) {
  return (
    <Card className="flex-1">
      <CardContent>
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label={`Giải thích: ${label}`}
              >
                <HelpCircle className="size-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{value}</p>
        {subline && (
          <p className="mt-1 text-xs text-muted-foreground">{subline}</p>
        )}
      </CardContent>
    </Card>
  )
}

interface SupplierMetricsGridProps {
  metrics: SupplierMetrics
}

/** 4-card KPI row for supplier metrics */
export function SupplierMetricsGrid({ metrics }: SupplierMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Tổng mặt hàng"
        value={metrics.sku_count_total.toLocaleString("vi-VN")}
        tooltip="Số lượng mặt hàng khác nhau đã từng nhập từ nhà cung cấp này."
      />
      <MetricCard
        label="Đơn đặt hàng 90 ngày"
        value={metrics.po_count_90d.toLocaleString("vi-VN")}
        tooltip="Số đơn đặt hàng đã tạo với nhà cung cấp trong 90 ngày gần nhất."
      />
      <MetricCard
        label="Doanh số 90 ngày"
        value={formatCurrency(metrics.revenue_90d)}
        tooltip="Tổng giá trị các đơn đặt hàng với nhà cung cấp trong 90 ngày gần nhất."
      />
      <MetricCard
        label="Nhu cầu 30 ngày (dự kiến)"
        value={formatCurrency(metrics.expected_need_30d)}
        tooltip="Giá trị ước tính cần đặt trong 30 ngày tới, bằng dự báo số lượng nhân với giá nhập trung bình 90 ngày gần nhất."
        subline="Ước tính từ dự báo 30 ngày và giá trung bình 90 ngày"
      />
    </div>
  )
}

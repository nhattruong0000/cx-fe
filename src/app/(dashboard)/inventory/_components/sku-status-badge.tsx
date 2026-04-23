"use client"

import { Badge } from "@/components/ui/badge"
import type { StockStatus } from "@/types/inventory"
import { STOCK_STATUS_LABELS } from "@/lib/stock-status-labels"

/** Maps StockStatus to badge variant — labels sourced from STOCK_STATUS_LABELS for consistency */
const STATUS_VARIANT: Record<StockStatus, "success" | "warning" | "destructive"> = {
  ok: "success",
  warn: "warning",
  critical: "destructive",
}

interface SkuStatusBadgeProps {
  status: StockStatus
}

/** Badge showing Vietnamese stock status label with appropriate color */
export function SkuStatusBadge({ status }: SkuStatusBadgeProps) {
  const variant = STATUS_VARIANT[status] ?? ("outline" as const)
  const label = STOCK_STATUS_LABELS[status] ?? status
  return <Badge variant={variant}>{label}</Badge>
}

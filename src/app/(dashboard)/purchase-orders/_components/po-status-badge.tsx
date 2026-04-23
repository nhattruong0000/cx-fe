"use client"

import { Badge } from "@/components/ui/badge"
import type { PurchaseOrderStatus } from "@/types/inventory"

/** Maps PO status values (from BE STATUS_LABELS) to Vietnamese label + badge variant */
const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "outline" | "secondary" | "default" | "success" }
> = {
  unknown: { label: "—", variant: "outline" },
  not_started: { label: "Chưa bắt đầu", variant: "secondary" },
  in_progress: { label: "Đang xử lý", variant: "default" },
  completed: { label: "Hoàn thành", variant: "success" },
}

interface PoStatusBadgeProps {
  status: PurchaseOrderStatus
}

/** Renders Vietnamese PO status badge with appropriate color variant */
export function PoStatusBadge({ status }: PoStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

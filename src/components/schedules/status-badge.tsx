"use client";

import { Badge } from "@/components/ui/badge";
import type { SupportStatus } from "@/types/support";

const statusConfig: Record<SupportStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Chờ xử lý", variant: "outline" },
  scheduled: { label: "Đã hẹn", variant: "secondary" },
  in_progress: { label: "Đang thực hiện", variant: "default" },
  completed: { label: "Hoàn thành", variant: "default" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

export function StatusBadge({ status }: { status: SupportStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

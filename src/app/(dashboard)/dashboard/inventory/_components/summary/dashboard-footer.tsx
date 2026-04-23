"use client";

// Footer: last-updated timestamp + manual refresh button that invalidates the summary query.

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";
import { useInvalidateDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";
import { formatLastUpdated } from "./derive-helpers";

export function DashboardFooter() {
  const { data, isFetching } = useInventoryDashboardSummary();
  const invalidate = useInvalidateDashboardSummary();

  const timestamp = data?.generated_at
    ? `Cập nhật lần cuối: ${formatLastUpdated(data.generated_at)}`
    : "Chưa có dữ liệu";

  return (
    <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
      <span>{timestamp}</span>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={invalidate}
        disabled={isFetching}
        aria-label="Làm mới dữ liệu"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
        Làm mới
      </Button>
    </div>
  );
}

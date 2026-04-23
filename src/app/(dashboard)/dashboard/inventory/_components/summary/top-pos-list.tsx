"use client";

// Top 10 upcoming/overdue POs sorted desc by |days_drift|. Links to /purchase-orders.

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";
import { formatDaysDrift, formatPoStatus } from "./derive-helpers";

export function TopPosList() {
  const { data, isLoading, isError } = useInventoryDashboardSummary();
  const pos = data?.top_lists.upcoming_or_overdue_pos ?? [];

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top 10 PO sắp / quá hạn</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-muted" />
            ))}
          </div>
        )}
        {!isLoading && isError && (
          <p className="p-4 text-xs text-destructive">Không tải được dữ liệu.</p>
        )}
        {!isLoading && !isError && pos.length === 0 && (
          <p className="p-4 text-xs text-muted-foreground">Không có PO sắp / quá hạn.</p>
        )}
        {!isLoading && !isError && pos.length > 0 && (
          <ul className="divide-y divide-border">
            {pos.map((po) => (
              <li key={po.po_id} className="px-4 py-2 hover:bg-muted/50">
                <Link
                  href="/purchase-orders"
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{po.po_number}</p>
                    <p className="truncate text-muted-foreground">{po.supplier_name}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={
                        po.status === "overdue"
                          ? "font-semibold text-destructive"
                          : "text-foreground"
                      }
                    >
                      {formatPoStatus(po.status)}
                    </p>
                    <p className="text-muted-foreground">{formatDaysDrift(po.days_drift)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-border px-4 py-2">
          <Link
            href="/purchase-orders"
            className="text-xs text-primary hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

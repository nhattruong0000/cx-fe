"use client";

// Top 10 off-cadence suppliers — admin-only. Links to /inventory/suppliers/{id}.

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";
import { formatAvgGap } from "./derive-helpers";

export function TopOffCadenceSuppliersList() {
  const { data, isLoading, isError } = useInventoryDashboardSummary();
  const suppliers = data?.top_lists.off_cadence_suppliers ?? [];

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top 10 NCC lệch nhịp</CardTitle>
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
        {!isLoading && !isError && suppliers.length === 0 && (
          <p className="p-4 text-xs text-muted-foreground">Không có NCC lệch nhịp.</p>
        )}
        {!isLoading && !isError && suppliers.length > 0 && (
          <ul className="divide-y divide-border">
            {suppliers.map((sup) => (
              <li key={sup.supplier_id} className="px-4 py-2 hover:bg-muted/50">
                <Link
                  href={`/inventory/suppliers/${sup.supplier_id}`}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{sup.supplier_name}</p>
                    <p className="text-muted-foreground">
                      Nhịp trung bình: {formatAvgGap(sup.avg_gap_days)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={
                        sup.overdue
                          ? "font-semibold text-destructive"
                          : "text-yellow-600"
                      }
                    >
                      {sup.overdue ? "Quá hạn" : "Lệch nhịp"}
                    </p>
                    <p className="text-muted-foreground">
                      {sup.days_since_last_inward} ngày chưa nhập
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-border px-4 py-2">
          <Link
            href="/inventory/suppliers"
            className="text-xs text-primary hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

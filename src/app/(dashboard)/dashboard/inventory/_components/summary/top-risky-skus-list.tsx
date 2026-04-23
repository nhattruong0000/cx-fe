"use client";

// Top 10 risky SKUs list card — sorted desc by risk_score. Each row links to /inventory/sku/{code}.

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";
import { docUrgencyClass, formatDaysCover, formatRiskScore } from "./derive-helpers";

export function TopRiskySkusList() {
  const { data, isLoading, isError } = useInventoryDashboardSummary();
  const skus = data?.top_lists.risky_skus ?? [];

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top 10 SKU rủi ro</CardTitle>
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
        {!isLoading && !isError && skus.length === 0 && (
          <p className="p-4 text-xs text-muted-foreground">Không có SKU rủi ro.</p>
        )}
        {!isLoading && !isError && skus.length > 0 && (
          <ul className="divide-y divide-border">
            {skus.map((sku) => (
              <li key={sku.code} className="px-4 py-2 hover:bg-muted/50">
                <Link href={`/inventory/sku/${encodeURIComponent(sku.code)}`} className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{sku.name_vi}</p>
                    <p className="text-muted-foreground">{sku.code}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={docUrgencyClass(sku.days_of_cover)}>
                      {formatDaysCover(sku.days_of_cover)}
                    </p>
                    <p className="text-muted-foreground">
                      Rủi ro: {formatRiskScore(sku.risk_score)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-border px-4 py-2">
          <Link
            href="/inventory"
            className="text-xs text-primary hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

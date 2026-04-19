"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInventoryAlerts } from "../_hooks/use-inventory-alerts";
import { useStockStatusBatch } from "../_hooks/use-stock-status";
import { useInventoryDashboardStore } from "../_store/inventory-dashboard-store";
import { formatDate, formatNumber } from "./inventory-format-utils";
import type { StockPurchaseOrder, StockStatusResponse } from "@/types/inventory";

const MAX_SKUS = 50;
const TOP_PO_LIMIT = 10;

interface AggregatedPo extends StockPurchaseOrder {
  item_code: string;
}

function aggregate(data: StockStatusResponse[]): {
  all: AggregatedPo[];
  openCount: number;
  overdueCount: number;
  nextEta: string | null;
} {
  const all: AggregatedPo[] = [];
  for (const s of data) {
    for (const po of s.purchase_orders) {
      all.push({ ...po, item_code: s.item_code });
    }
  }
  const openCount = all.length;
  const overdueCount = all.filter((p) => p.is_overdue).length;
  const futureEtas = all
    .map((p) => p.eta_date)
    .filter((d): d is string => Boolean(d))
    .sort();
  return {
    all,
    openCount,
    overdueCount,
    nextEta: futureEtas[0] ?? null,
  };
}

export function PoPipelineCard() {
  const { branchFilter } = useInventoryDashboardStore();

  const { data: alertList } = useInventoryAlerts({
    status: "open",
    per_page: 200,
    branch_id: branchFilter ?? undefined,
  });

  const codes = useMemo(() => {
    const set = new Set<string>();
    for (const a of alertList?.data ?? []) set.add(a.item_code);
    return Array.from(set).slice(0, MAX_SKUS);
  }, [alertList]);

  const batch = useStockStatusBatch(codes, {
    branch_id: branchFilter ?? undefined,
  });

  const { all, openCount, overdueCount, nextEta } = useMemo(
    () => aggregate(batch.data),
    [batch.data]
  );

  const topPos = useMemo(() => {
    return [...all]
      .sort((a, b) => {
        if (a.is_overdue !== b.is_overdue) return a.is_overdue ? -1 : 1;
        return (a.days_to_eta ?? 9999) - (b.days_to_eta ?? 9999);
      })
      .slice(0, TOP_PO_LIMIT);
  }, [all]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline đơn mua (PO)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded border bg-muted/30 p-2">
            <p className="text-xs text-muted-foreground">Đơn mở</p>
            <p className="text-lg font-semibold">{openCount}</p>
          </div>
          <div className="rounded border bg-muted/30 p-2">
            <p className="text-xs text-muted-foreground">Quá hạn</p>
            <p className="text-lg font-semibold text-[#DC2626]">{overdueCount}</p>
          </div>
          <div className="rounded border bg-muted/30 p-2">
            <p className="text-xs text-muted-foreground">ETA gần nhất</p>
            <p className="text-sm font-medium">{formatDate(nextEta)}</p>
          </div>
        </div>

        {topPos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="py-1.5 pr-2">PO</th>
                  <th className="py-1.5 pr-2">SKU</th>
                  <th className="py-1.5 pr-2 text-right">SL</th>
                  <th className="py-1.5 pr-2">ETA</th>
                  <th className="py-1.5 pr-2 text-right">Ngày</th>
                  <th className="py-1.5 pr-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {topPos.map((po) => (
                  <tr key={`${po.item_code}-${po.pu_order_id}`} className="border-b last:border-b-0">
                    <td className="py-1.5 pr-2 font-mono">{po.pu_order_id.slice(0, 8)}</td>
                    <td className="py-1.5 pr-2">{po.item_code}</td>
                    <td className="py-1.5 pr-2 text-right">{formatNumber(po.open_qty)}</td>
                    <td className="py-1.5 pr-2">{formatDate(po.eta_date)}</td>
                    <td className="py-1.5 pr-2 text-right">{po.days_to_eta ?? "—"}</td>
                    <td className="py-1.5 pr-2">
                      {po.is_overdue ? (
                        <Badge variant="destructive">Quá hạn</Badge>
                      ) : (
                        <Badge variant="secondary">Đúng hạn</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Không có PO mở.</p>
        )}
      </CardContent>
    </Card>
  );
}

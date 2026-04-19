"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInventoryAlerts } from "../_hooks/use-inventory-alerts";
import { useStockStatusBatch } from "../_hooks/use-stock-status";
import { useInventoryDashboardStore } from "../_store/inventory-dashboard-store";
import { formatNumber, formatDays } from "./inventory-format-utils";
import type { StockStatusResponse } from "@/types/inventory";

const MAX_SKUS = 50;

/** Derive unique SKU codes from open alerts (Phase 1 default source). */
function uniqueItemCodes(codes: string[]): string[] {
  return Array.from(new Set(codes)).slice(0, MAX_SKUS);
}

function daysOfCover(s: StockStatusResponse): number | null {
  const avg = s.recent_demand?.avg_daily_qty;
  if (!avg || avg <= 0) return null;
  return Math.round(s.total_on_hand / avg);
}

function forecast30d(s: StockStatusResponse): number | null {
  const hit = s.latest_forecasts.find((f) => f.horizon_days === 30);
  return hit?.qty_forecast ?? null;
}

function isReorderNeeded(s: StockStatusResponse): boolean {
  return s.open_alerts_count > 0;
}

export function StockStatusGrid() {
  const { selectedSku, selectSku, itemCodeSearch, branchFilter } =
    useInventoryDashboardStore();

  // Default SKU list: union of item_codes from currently open alerts.
  const { data: alertList } = useInventoryAlerts({
    status: "open",
    per_page: 200,
    branch_id: branchFilter ?? undefined,
  });

  const skuCodes = useMemo(() => {
    const fromAlerts = (alertList?.data ?? []).map((a) => a.item_code);
    return uniqueItemCodes(fromAlerts);
  }, [alertList]);

  const batch = useStockStatusBatch(skuCodes, {
    branch_id: branchFilter ?? undefined,
  });

  const filtered = useMemo(() => {
    const q = itemCodeSearch.trim().toLowerCase();
    const rows = batch.data;
    if (!q) return rows;
    return rows.filter((r) => r.item_code.toLowerCase().includes(q));
  }, [batch.data, itemCodeSearch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái tồn kho</CardTitle>
        <p className="text-xs text-muted-foreground">
          {skuCodes.length} SKU từ cảnh báo mở · hiển thị {filtered.length}
        </p>
      </CardHeader>
      <CardContent>
        {batch.isLoading && skuCodes.length > 0 && (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải {skuCodes.length} SKU…
          </div>
        )}

        {skuCodes.length === 0 && !batch.isLoading && (
          <p className="py-6 text-sm text-muted-foreground">
            Không có SKU nào từ cảnh báo mở.
          </p>
        )}

        {filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">SKU</th>
                  <th className="py-2 pr-3">Chi nhánh</th>
                  <th className="py-2 pr-3 text-right">Tồn kho</th>
                  <th className="py-2 pr-3 text-right">Dự báo 30d</th>
                  <th className="py-2 pr-3 text-right">Days-of-cover</th>
                  <th className="py-2 pr-3 text-right">Cung thực</th>
                  <th className="py-2 pr-3">Đặt hàng lại</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const cover = daysOfCover(s);
                  const needsReorder = isReorderNeeded(s);
                  const isSelected = selectedSku === s.item_code;
                  return (
                    <tr
                      key={s.item_code}
                      onClick={() => selectSku(s.item_code)}
                      className={`cursor-pointer border-b last:border-b-0 hover:bg-muted/50 ${
                        isSelected ? "bg-[#EFF6FF]" : ""
                      }`}
                    >
                      <td className="py-2 pr-3 font-medium">{s.item_code}</td>
                      <td className="py-2 pr-3 text-xs text-muted-foreground">
                        {Array.isArray(s.branch_id) ? s.branch_id.join(", ") : s.branch_id}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {formatNumber(s.total_on_hand)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {formatNumber(forecast30d(s))}
                      </td>
                      <td className="py-2 pr-3 text-right">{formatDays(cover)}</td>
                      <td className="py-2 pr-3 text-right">
                        {formatNumber(s.supply_breakdown.effective_supply)}
                      </td>
                      <td className="py-2 pr-3">
                        {needsReorder ? (
                          <Badge variant="destructive">Cần</Badge>
                        ) : (
                          <Badge variant="secondary">Ổn</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

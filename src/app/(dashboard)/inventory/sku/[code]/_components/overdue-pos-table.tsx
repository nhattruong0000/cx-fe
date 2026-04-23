"use client";

/**
 * Overdue POs Table — compact table of overdue purchase orders,
 * sorted by expediting priority. Days overdue colored amber (7-14) or red (>14).
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EvidencePurchaseOrder } from "@/types/inventory-evidence";

interface OverduePosTableProps {
  overdue: EvidencePurchaseOrder[];
  expediting: EvidencePurchaseOrder[];
}

function daysOverdue(po: EvidencePurchaseOrder): number {
  if (po.days_to_eta === null) return 0;
  // days_to_eta negative means overdue by that many days
  return po.days_to_eta < 0 ? Math.abs(po.days_to_eta) : 0;
}

function DaysOverdueBadge({ days }: { days: number }) {
  if (days > 14) return <Badge variant="destructive">+{days} ngày</Badge>;
  if (days > 7) return <Badge variant="warning">+{days} ngày</Badge>;
  return <Badge variant="secondary">+{days} ngày</Badge>;
}

export function OverduePosTable({ overdue, expediting }: OverduePosTableProps) {
  // Use expediting order if available, fall back to overdue list sorted by days desc
  const sorted = expediting.length > 0
    ? expediting
    : [...overdue].sort((a, b) => daysOverdue(b) - daysOverdue(a));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <span>Đơn đặt hàng quá hạn</span>
          {overdue.length > 0 && (
            <Badge variant="destructive">{overdue.length} đơn</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Không có đơn quá hạn.
          </p>
        ) : (
          <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-border pb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              <span>Mã đơn</span>
              <span className="text-right">Còn lại (sp)</span>
              <span className="text-right">Quá hạn</span>
            </div>
            {/* Rows */}
            {sorted.map((po) => {
              const days = daysOverdue(po);
              return (
                <div
                  key={po.pu_order_id}
                  className="grid grid-cols-3 items-center border-b border-border/40 py-2 text-xs last:border-0"
                >
                  <span className="font-mono font-medium text-foreground">
                    {po.pu_order_id}
                  </span>
                  <span className="text-right text-muted-foreground">
                    {po.open_qty?.toLocaleString("vi-VN") ?? "—"}
                  </span>
                  <div className="flex justify-end">
                    {days > 0 ? (
                      <DaysOverdueBadge days={days} />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

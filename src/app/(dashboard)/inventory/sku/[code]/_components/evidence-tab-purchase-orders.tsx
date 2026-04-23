"use client";

/**
 * Purchase Orders tab — effective supply breakdown + open PO list
 * + overdue POs ranked by expediting priority.
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplyBreakdownCard } from "./supply-breakdown-card";
import type { InventoryEvidenceBundle } from "@/types/inventory-evidence";

interface EvidenceTabPurchaseOrdersProps {
  evidence: InventoryEvidenceBundle;
}

function daysToEtaLabel(days: number | null): React.ReactNode {
  if (days === null) return <span className="text-muted-foreground">—</span>;
  if (days < 0)
    return (
      <Badge variant="destructive">Quá hạn {Math.abs(days)} ngày</Badge>
    );
  if (days === 0)
    return <Badge variant="warning">Hôm nay</Badge>;
  return <span className="text-foreground">{days} ngày nữa</span>;
}

export function EvidenceTabPurchaseOrders({ evidence }: EvidenceTabPurchaseOrdersProps) {
  const { supply_breakdown, purchase_orders } = evidence;
  const openList = purchase_orders.open_list;
  const expediting = purchase_orders.expediting_priority;

  return (
    <div className="flex flex-col gap-6">
      {/* Supply breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SupplyBreakdownCard supply={supply_breakdown} />
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:grid-cols-2 lg:content-start">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground">Đơn đang mở</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{openList.length}</p>
              <p className="text-xs text-muted-foreground">đơn đặt hàng</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground">Đơn quá hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${purchase_orders.overdue_list.length > 0 ? "text-destructive" : "text-foreground"}`}>
                {purchase_orders.overdue_list.length}
              </p>
              <p className="text-xs text-muted-foreground">cần xử lý</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Open POs table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Danh sách đơn đặt hàng đang mở</CardTitle>
        </CardHeader>
        <CardContent>
          {openList.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Không có đơn đặt hàng đang mở.
            </p>
          ) : (
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-4 border-b border-border pb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>Mã đơn</span>
                <span className="text-right">Ngày đặt</span>
                <span className="text-right">Còn lại (sp)</span>
                <span className="text-right">Ngày dự kiến</span>
              </div>
              {openList.map((po) => (
                <div
                  key={po.pu_order_id}
                  className="grid grid-cols-4 items-center border-b border-border/40 py-2.5 text-xs last:border-0"
                >
                  <span className="font-mono font-medium text-foreground">{po.pu_order_id}</span>
                  <span className="text-right text-muted-foreground">
                    {po.refdate ? new Date(po.refdate).toLocaleDateString("vi-VN") : "—"}
                  </span>
                  <span className="text-right text-foreground">
                    {po.open_qty?.toLocaleString("vi-VN") ?? "—"}
                  </span>
                  <div className="flex justify-end text-right">
                    {daysToEtaLabel(po.days_to_eta)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expediting priority list */}
      {expediting.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              Ưu tiên xử lý
              <Badge variant="destructive">{expediting.length} đơn</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-3 border-b border-border pb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>Mã đơn</span>
                <span className="text-right">Số lượng còn lại</span>
                <span className="text-right">Trạng thái</span>
              </div>
              {expediting.map((po) => (
                <div
                  key={po.pu_order_id}
                  className="grid grid-cols-3 items-center border-b border-border/40 py-2.5 text-xs last:border-0"
                >
                  <span className="font-mono font-medium text-foreground">{po.pu_order_id}</span>
                  <span className="text-right text-foreground">
                    {po.open_qty?.toLocaleString("vi-VN") ?? "—"}
                  </span>
                  <div className="flex justify-end">
                    {daysToEtaLabel(po.days_to_eta)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

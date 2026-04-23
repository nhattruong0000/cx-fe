"use client";

/**
 * Supply Breakdown Card — shows effective supply components:
 * on_hand + confirmed POs - reserved = total sellable supply.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import type { EvidenceSupplyBreakdown } from "@/types/inventory-evidence";

interface SupplyBreakdownCardProps {
  supply: EvidenceSupplyBreakdown;
}

export function SupplyBreakdownCard({ supply }: SupplyBreakdownCardProps) {
  // Coerce BE values — API may return numeric strings in some edge cases
  const onHand = isFinite(Number(supply.on_hand)) ? Number(supply.on_hand) : 0;
  const onOrderWithin = isFinite(Number(supply.on_order_within_lead_time)) ? Number(supply.on_order_within_lead_time) : 0;
  const onOrderTotal = isFinite(Number(supply.on_order_total)) ? Number(supply.on_order_total) : 0;
  const effectiveSupply = isFinite(Number(supply.effective_supply)) ? Number(supply.effective_supply) : 0;

  // Orders outside lead time = total - within; shown as deducted from "available now"
  const outsideLeadTime = onOrderTotal - onOrderWithin;

  const rows: { label: string; value: number; isTotal?: boolean; isNegative?: boolean }[] = [
    { label: "Tồn kho thực tế", value: onHand },
    { label: "Đơn đặt hàng đã xác nhận (trong LT)", value: onOrderWithin },
    { label: "Đơn ngoài thời gian giao (chưa tính)", value: outsideLeadTime, isNegative: true },
    { label: "Tổng cung có thể bán", value: effectiveSupply, isTotal: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          Cung có thể bán
          <HelpTooltip>
            Lượng hàng thực tế có thể bán ra, tính bằng: Tồn kho + Đơn đặt hàng đã xác nhận trong thời gian giao − Hàng đã giữ.
          </HelpTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Big value */}
        <p className="mb-4 text-3xl font-bold text-foreground">
          {effectiveSupply.toLocaleString("vi-VN")}
          <span className="ml-1 text-sm font-normal text-muted-foreground">sp</span>
        </p>

        {/* Breakdown table */}
        <div className="flex flex-col gap-0">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-1.5 text-xs ${
                row.isTotal
                  ? "border-t border-border pt-2 font-semibold text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <span className={row.isTotal ? "text-foreground" : ""}>
                {row.isTotal ? "=" : row.isNegative ? "−" : "+"} {row.label}
              </span>
              <span className={row.isTotal ? "text-primary" : ""}>
                {row.value.toLocaleString("vi-VN")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

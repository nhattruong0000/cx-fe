"use client";

/**
 * Suggested PO Card — displays the recommended purchase order quantity
 * with formula breakdown and copy-to-clipboard action.
 */

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import type { EvidenceSuggestedPo } from "@/types/inventory-evidence";

interface SuggestedPoCardProps {
  suggestedPo: EvidenceSuggestedPo;
}

export function SuggestedPoCard({ suggestedPo: po }: SuggestedPoCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(String(po.qty_rounded)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const coverDays = po.cover_days;
  const batchSize = po.batch_size ?? 1;
  const hasSuggestion =
    po.qty_rounded > 0 &&
    po.demand_daily != null &&
    po.demand_daily > 0;

  if (!hasSuggestion) {
    return (
      <Card className="border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            Đề xuất đặt hàng
            <HelpTooltip>
              Lượng đặt hàng được tính tự động dựa trên nhu cầu trung bình mỗi ngày, thời gian giao hàng và dự trữ an toàn.
            </HelpTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Chưa tính được đề xuất đặt hàng — thiếu dữ liệu nhu cầu hàng ngày.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          Đề xuất đặt hàng
          <HelpTooltip>
            Lượng đặt hàng được tính tự động dựa trên nhu cầu trung bình mỗi ngày, thời gian giao hàng và dự trữ an toàn.
          </HelpTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Big value + copy */}
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-primary">
            {po.qty_rounded.toLocaleString("vi-VN")}
          </span>
          <span className="text-sm text-muted-foreground">sp</span>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto h-7 gap-1.5 text-xs"
            onClick={handleCopy}
            aria-label="Sao chép số lượng đề xuất"
          >
            {copied ? (
              <><Check className="size-3" /> Đã sao chép</>
            ) : (
              <><Copy className="size-3" /> Sao chép</>
            )}
          </Button>
        </div>

        {/* Formula box */}
        <div className="rounded-lg bg-background/60 p-3 text-xs text-muted-foreground ring-1 ring-border">
          <p className="mb-1 font-medium text-foreground">Công thức tính:</p>
          <p>Lượng cần đặt = Nhu cầu/ngày × (Thời gian giao + Dự trữ an toàn)</p>
          <p className="mt-1.5 font-mono text-foreground">
            = {(po.demand_daily ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}
            {" × "}({po.lead_p90} ngày giao + {Math.max(0, coverDays - po.lead_p90)} ngày dự trữ)
            {" = "}{isFinite(po.qty_raw) ? po.qty_raw.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) : "—"}
          </p>
          {batchSize > 1 && (
            <p className="mt-0.5 font-mono text-primary">
              → làm tròn lên bội {batchSize} = {po.qty_rounded.toLocaleString("vi-VN")}
            </p>
          )}
          {po.vendor_code && (
            <p className="mt-1.5 text-muted-foreground">
              Nhà cung cấp gợi ý: <span className="font-medium text-foreground">{po.vendor_code}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

/**
 * Alert Card — shows inventory alert severity, days-of-stock remaining,
 * and gate reasons why the alert was triggered.
 */

import { AlertTriangle, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import type { EvidenceAlertSection, EvidenceOnHand } from "@/types/inventory-evidence";
import { ALERT_STATUS_CONFIG, getAlertUiStatus } from "@/lib/inventory-alert-status";

interface AlertCardProps {
  alert: EvidenceAlertSection;
  onHand: EvidenceOnHand;
}

const GATE_REASON_LABEL: Record<string, string> = {
  dos_critical: "Số ngày tồn kho dưới mức nguy cấp",
  dos_warn: "Số ngày tồn kho gần ngưỡng cảnh báo",
  no_forecast: "Chưa có dữ liệu dự báo",
  low_reliability: "Độ tin cậy dữ liệu thấp",
  no_vendor: "Chưa có nhà cung cấp liên kết",
  overdue_po: "Có đơn đặt hàng quá hạn chưa xử lý",
};

export function AlertCard({ alert, onHand }: AlertCardProps) {
  const status = getAlertUiStatus({ alert, on_hand: onHand });
  const cfg = ALERT_STATUS_CONFIG[status];
  const isCritical = status === "critical" || status === "stockout";
  const isWarn = status === "warn" || status === "warning";
  const isInsufficient = status === "insufficient_data";
  const showWarning = isCritical || isWarn;

  return (
    <Card className={showWarning ? "border-warning/60 bg-warning/5" : isInsufficient ? "border-border bg-muted/30" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {showWarning && <AlertTriangle className="size-4 text-warning" />}
          {isInsufficient && <HelpCircle className="size-4 text-muted-foreground" />}
          <span>Cảnh báo tồn kho</span>
          <HelpTooltip>
            Trạng thái cảnh báo dựa trên số ngày tồn kho còn lại so với ngưỡng đặt hàng và chất lượng dữ liệu.
          </HelpTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Severity + DOS */}
        <div className="flex items-center gap-2">
          <Badge variant={cfg.variant}>{cfg.label}</Badge>
          {alert.dos !== null && !isInsufficient && (
            <span className={`text-sm font-medium ${alert.dos < 7 ? "text-destructive" : "text-foreground"}`}>
              {alert.dos.toLocaleString("vi-VN")} ngày tồn còn lại
            </span>
          )}
        </div>

        {/* Explanation */}
        <p className="text-xs text-muted-foreground">
          {isInsufficient
            ? "Chưa đủ dữ liệu phân tích. SKU này chưa có lịch sử bán hàng đủ để tính dự báo và cảnh báo."
            : isCritical
            ? "Tồn kho sắp hết — cần đặt hàng ngay để tránh thiếu hụt."
            : isWarn
            ? "Tồn kho đang xuống thấp — nên lên kế hoạch đặt hàng sớm."
            : "Tồn kho đang ở mức an toàn."}
        </p>

        {/* Gate reasons */}
        {alert.gate_reasons.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Nguyên nhân:</p>
            <ul className="flex flex-col gap-1">
              {alert.gate_reasons.map((r) => (
                <li key={r} className="flex items-start gap-1.5 text-xs text-foreground">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-warning" />
                  {GATE_REASON_LABEL[r] ?? r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

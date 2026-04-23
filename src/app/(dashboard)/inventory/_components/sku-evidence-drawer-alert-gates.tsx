import { HelpTooltip } from "@/components/ui/help-tooltip"
import { Badge } from "@/components/ui/badge"
import type { EvidenceAlertSection, EvidenceOnHand } from "@/types/inventory-evidence"

/** Map raw gate_reason keys → Vietnamese descriptions */
function formatGateReason(reason: string): string {
  const map: Record<string, string> = {
    dos_below_lead_time: "Tồn kho không đủ cho thời gian chờ giao hàng",
    dos_below_safety_stock: "Tồn kho dưới mức dự trữ an toàn",
    zero_forecast: "Dự báo nhu cầu bằng 0",
    low_confidence: "Độ tin cậy dự báo thấp",
    negative_on_hand: "Tồn kho âm (dữ liệu bất thường)",
    no_history: "Không đủ lịch sử bán hàng",
    overdue_po: "Có đơn nhập hàng quá hạn chưa về",
  }
  return map[reason] ?? reason
}

interface Props {
  alert: EvidenceAlertSection
  onHand: EvidenceOnHand
}

/** Section 3 — Cảnh báo (DOS + gate reasons) */
export function SkuEvidenceDrawerAlertGates({ alert, onHand }: Props) {
  const dosValue = alert.dos != null ? Math.round(alert.dos) : null
  const demandDaily = alert.demand_daily

  // Determine badge variant based on severity
  const badgeVariant: "warning" | "destructive" =
    alert.severity === "critical" || alert.severity === "stockout"
      ? "destructive"
      : "warning"

  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">Cảnh báo</span>
        <HelpTooltip>
          DOS (Days of Stock) = số ngày tồn kho còn lại dựa trên tốc độ tiêu thụ hàng ngày.
        </HelpTooltip>
      </div>

      {/* DOS badge + formula */}
      {dosValue != null && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant}>
              {dosValue} ngày tồn
            </Badge>
          </div>
          {demandDaily != null && demandDaily > 0 && (
            <p className="text-xs text-muted-foreground">
              Số ngày tồn còn lại = Tồn thực tế ({onHand.total.toLocaleString("vi-VN")}) ÷ nhu cầu mỗi ngày ({demandDaily.toFixed(1)})
            </p>
          )}
        </div>
      )}

      {/* Gate reasons list */}
      {alert.gate_reasons.length > 0 ? (
        <ul className="flex flex-col gap-1.5" aria-label="Nguyên nhân cảnh báo">
          {alert.gate_reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive"
                aria-hidden="true"
              />
              <span className="text-foreground">{formatGateReason(reason)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Không có cảnh báo đặc biệt.</p>
      )}
    </div>
  )
}

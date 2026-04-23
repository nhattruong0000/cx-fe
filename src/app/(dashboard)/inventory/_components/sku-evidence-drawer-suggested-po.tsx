import { HelpTooltip } from "@/components/ui/help-tooltip"
import type { EvidenceSuggestedPo } from "@/types/inventory-evidence"

interface Props {
  suggestedPo: EvidenceSuggestedPo
}

/** Section 5 — Đề xuất đặt hàng with inline arithmetic formula */
export function SkuEvidenceDrawerSuggestedPo({ suggestedPo }: Props) {
  const {
    demand_daily,
    lead_p90,
    qty_raw,
    qty_rounded,
    batch_size,
  } = suggestedPo

  const hasSuggestion = qty_rounded > 0 && demand_daily != null && demand_daily > 0

  if (!hasSuggestion) {
    return (
      <div className="flex flex-col gap-2 px-5 py-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">Đề xuất đặt hàng</span>
          <HelpTooltip>
            Số lượng đề xuất đặt thêm để không bị hết hàng trong thời gian chờ giao hàng + 30 ngày dự trữ.
          </HelpTooltip>
        </div>
        <p className="text-sm text-muted-foreground">
          Chưa tính được đề xuất đặt hàng — thiếu dữ liệu nhu cầu hàng ngày.
        </p>
      </div>
    )
  }

  // Vietnamese formula: X/ngày × (Y ngày + 30 dự trữ) = raw → làm tròn lên bội batch
  const batchText = batch_size && batch_size > 1
    ? ` → làm tròn lên bội ${batch_size.toLocaleString("vi-VN")} = ${qty_rounded.toLocaleString("vi-VN")}`
    : ""

  const formulaText =
    `Nhu cầu mỗi ngày (${(demand_daily ?? 0).toFixed(1)}) × (thời gian giao hàng ${lead_p90} + dự trữ 30) = ${Math.round(qty_raw).toLocaleString("vi-VN")}${batchText}`

  return (
    <div className="flex flex-col gap-2 px-5 py-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">Đề xuất đặt hàng</span>
        <HelpTooltip>
          Số lượng đề xuất đặt thêm để không bị hết hàng trong thời gian chờ giao hàng + 30 ngày dự trữ.
        </HelpTooltip>
      </div>

      <p className="text-2xl font-bold tabular-nums text-foreground">
        {qty_rounded.toLocaleString("vi-VN")}
        <span className="ml-1.5 text-base font-normal text-muted-foreground">cái</span>
      </p>

      <p className="text-xs text-muted-foreground leading-relaxed">{formulaText}</p>
    </div>
  )
}

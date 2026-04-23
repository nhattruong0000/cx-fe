import { HelpTooltip } from "@/components/ui/help-tooltip"
import type { EvidenceSupplyBreakdown } from "@/types/inventory-evidence"

interface Props {
  supplyBreakdown: EvidenceSupplyBreakdown
}

/** Section 4 — Cung có thể bán (effective supply breakdown) */
export function SkuEvidenceDrawerSupplyBreakdown({ supplyBreakdown }: Props) {
  const onHand = supplyBreakdown.on_hand
  const onOrder = supplyBreakdown.on_order_within_lead_time
  const effective = supplyBreakdown.effective_supply

  return (
    <div className="flex flex-col gap-2 px-5 py-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">Cung có thể bán</span>
        <HelpTooltip>
          Lượng hàng thực tế có thể đáp ứng nhu cầu = Tồn thực tế + đơn nhập trong thời gian giao hàng.
        </HelpTooltip>
      </div>

      <p className="text-2xl font-bold tabular-nums text-foreground">
        {effective.toLocaleString("vi-VN")}
        <span className="ml-1.5 text-base font-normal text-muted-foreground">cái</span>
      </p>

      <p className="text-xs text-muted-foreground">
        Tồn thực tế {onHand.toLocaleString("vi-VN")} + đơn đang về {onOrder.toLocaleString("vi-VN")}
      </p>
    </div>
  )
}

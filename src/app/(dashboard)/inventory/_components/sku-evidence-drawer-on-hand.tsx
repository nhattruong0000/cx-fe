import { HelpTooltip } from "@/components/ui/help-tooltip"
import type { EvidenceOnHand } from "@/types/inventory-evidence"

interface Props {
  onHand: EvidenceOnHand
}

/** Section 1 — Tồn kho hiện tại */
export function SkuEvidenceDrawerOnHand({ onHand }: Props) {
  // Format sync age from synced_at timestamp
  let syncAge: string
  if (!onHand.synced_at) {
    syncAge = "Chưa có timestamp"
  } else {
    const diff = Math.floor((Date.now() - new Date(onHand.synced_at).getTime()) / 60_000)
    if (diff < 1) syncAge = "vừa đồng bộ"
    else if (diff < 60) syncAge = `${diff} phút trước`
    else syncAge = `${Math.floor(diff / 60)} giờ trước`
  }

  return (
    <div className="flex flex-col gap-2 px-5 py-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">Tồn kho hiện tại</span>
        <HelpTooltip>
          Số lượng tồn kho thực tế từ hệ thống AMIS, đồng bộ định kỳ.
        </HelpTooltip>
      </div>

      <p className="text-2xl font-bold tabular-nums text-foreground" data-testid="evidence-value">
        {onHand.total.toLocaleString("vi-VN")}
        <span className="ml-1.5 text-base font-normal text-muted-foreground">cái</span>
      </p>

      <p className="text-xs text-muted-foreground" data-testid="evidence-source">
        Nguồn: hệ thống AMIS · {syncAge}
      </p>
    </div>
  )
}

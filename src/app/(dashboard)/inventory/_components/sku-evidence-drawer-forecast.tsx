import { HelpTooltip } from "@/components/ui/help-tooltip"
import type { EvidenceForecast } from "@/types/inventory-evidence"

/** Map internal method codes → Vietnamese display labels */
function formatMethodLabel(method: string): string {
  const map: Record<string, string> = {
    ewma_alpha_0_3: "Trung bình trượt",
    ewma_alpha_0_5: "Trung bình trượt (nhanh)",
    ewma_alpha_0_7: "Trung bình trượt (rất nhanh)",
    moving_average: "Trung bình di động",
    naive: "Dự báo đơn giản",
    seasonal: "Mô hình mùa vụ",
  }
  return map[method] ?? method
}

interface Props {
  forecast: EvidenceForecast
}

/** Section 2 — Dự báo 30 ngày */
export function SkuEvidenceDrawerForecast({ forecast }: Props) {
  const methodLabel = formatMethodLabel(forecast.method)

  // Confidence interval swing — show ± half-width if both ci available
  let swingText: string | null = null
  if (forecast.ci_high != null && forecast.ci_low != null) {
    const swing = Math.round((forecast.ci_high - forecast.ci_low) / 2)
    swingText = `Dao động ±${swing.toLocaleString("vi-VN")}`
  }

  return (
    <div className="flex flex-col gap-2 px-5 py-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">Dự báo 30 ngày</span>
        <HelpTooltip>
          Số lượng dự kiến tiêu thụ trong 30 ngày tới, được tính bằng phương pháp thống kê từ lịch sử bán hàng.
        </HelpTooltip>
      </div>

      <p className="text-2xl font-bold tabular-nums text-foreground">
        {forecast.qty_forecast?.toLocaleString("vi-VN") ?? "—"}
        <span className="ml-1.5 text-base font-normal text-muted-foreground">cái</span>
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>Phương pháp: {methodLabel}</span>
        {swingText && <span>{swingText}</span>}
      </div>
    </div>
  )
}

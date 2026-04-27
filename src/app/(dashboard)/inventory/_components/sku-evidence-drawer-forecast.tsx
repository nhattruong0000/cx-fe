import { HelpTooltip } from "@/components/ui/help-tooltip"
import type { EvidenceAlertSection, EvidenceForecast } from "@/types/inventory-evidence"

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

/** DUS color band: red <7, yellow 7-14, green ≥14 */
function dusColor(dus: number | null): string {
  if (dus === null) return "text-muted-foreground"
  if (dus < 7) return "text-red-600 font-semibold"
  if (dus < 14) return "text-yellow-600 font-semibold"
  return "text-green-600 font-semibold"
}

function fmtNum(v: number | null, digits = 1): string {
  if (v === null) return "—"
  return v.toLocaleString("vi-VN", { maximumFractionDigits: digits })
}

interface Props {
  forecast: EvidenceForecast
  /** Alert section from evidence bundle — provides daily_rate (demand_daily) and DUS (dos) */
  alert?: EvidenceAlertSection | null
}

/** Section 2 — Dự báo 30 ngày (V2 native fields: daily_rate, DUS, classification, confidence) */
export function SkuEvidenceDrawerForecast({ forecast, alert }: Props) {
  const methodLabel = formatMethodLabel(forecast.method)
  const dailyRate = alert?.demand_daily ?? null
  const dus = alert?.dos ?? null

  // Confidence interval swing — show ± half-width if both ci available
  let swingText: string | null = null
  if (forecast.ci_high != null && forecast.ci_low != null) {
    const swing = Math.round((forecast.ci_high - forecast.ci_low) / 2)
    swingText = `Dao động ±${swing.toLocaleString("vi-VN")}`
  }

  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">Dự báo & tốc độ tiêu thụ</span>
        <HelpTooltip>
          Daily rate là tốc độ tiêu thụ trung bình mỗi ngày. DUS (Days of Supply) = tồn kho / daily rate.
        </HelpTooltip>
      </div>

      {/* V2 key metrics row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Daily rate */}
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Daily rate
          </span>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {dailyRate !== null ? `${fmtNum(dailyRate)} đv/ngày` : "—"}
          </span>
        </div>

        {/* DUS */}
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            DUS (ngày còn lại)
          </span>
          <span className={`text-sm tabular-nums ${dusColor(dus)}`}>
            {dus !== null ? `${fmtNum(dus)} ngày` : "—"}
          </span>
        </div>
      </div>

      {/* Method + confidence */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>Phương pháp: {methodLabel}</span>
        {forecast.confidence !== null && (
          <span>Độ tin cậy: {Math.round(forecast.confidence * 100)}%</span>
        )}
        {swingText && <span>{swingText}</span>}
      </div>
    </div>
  )
}

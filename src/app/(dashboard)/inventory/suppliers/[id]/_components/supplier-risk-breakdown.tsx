"use client"

import { HelpCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { SupplierRiskCounts, SupplierTopCriticalSku } from "@/types/inventory"

// ─── DUS color band ────────────────────────────────────────────────────────────

/** Returns Tailwind color classes for DUS value: red <7, yellow 7-14, green ≥14 */
function dusColorClass(dus: number | null): string {
  if (dus === null) return "text-muted-foreground"
  if (dus < 7) return "font-semibold text-red-600"
  if (dus < 14) return "font-semibold text-yellow-600"
  return "font-semibold text-green-600"
}

interface RiskPillProps {
  count: number
  label: string
  colorClass: string
}

/** Single risk pill showing count + label */
function RiskPill({ count, label, colorClass }: RiskPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${colorClass}`}
    >
      <span className="text-base font-bold tabular-nums">{count}</span>
      {label}
    </span>
  )
}

interface SupplierRiskBreakdownProps {
  riskCounts: SupplierRiskCounts
  topCritical: SupplierTopCriticalSku[]
  onSkuClick: (sku: SupplierTopCriticalSku) => void
}

/** Risk breakdown card: pill row + top-5 critical SKU list.
 *  Top-5 sorted by dus ASC (lowest DUS = most critical) — sort done by BE service.
 *  Renders DUS value with color band (red <7 / yellow 7-14 / green ≥14).
 */
export function SupplierRiskBreakdown({
  riskCounts,
  topCritical,
  onSkuClick,
}: SupplierRiskBreakdownProps) {
  // Sort client-side by dus ASC as defensive guard (BE already sorts; this handles any ordering)
  const sortedCritical = [...topCritical].sort((a, b) => {
    // Nulls go last (treat null as Infinity)
    const da = a.dus ?? Infinity
    const db = b.dus ?? Infinity
    return da - db
  })

  return (
    <Card>
      <CardContent className="space-y-5">
        {/* Section title with help tooltip */}
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Tình trạng rủi ro tồn kho</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="text-muted-foreground hover:text-foreground"
                aria-label="Giải thích tình trạng rủi ro tồn kho"
              >
                <HelpCircle className="size-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                Số lượng mặt hàng theo mức độ rủi ro tồn kho — ổn định, cảnh báo, nguy cấp.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Risk pills row */}
        <div className="flex flex-wrap gap-3">
          <RiskPill
            count={riskCounts.ok}
            label="Ổn định"
            colorClass="bg-green-100 text-green-700"
          />
          <RiskPill
            count={riskCounts.warn}
            label="Cảnh báo"
            colorClass="bg-yellow-100 text-yellow-700"
          />
          <RiskPill
            count={riskCounts.critical}
            label="Nguy cấp"
            colorClass="bg-red-100 text-red-700"
          />
        </div>

        {/* Top 5 critical list */}
        {sortedCritical.length > 0 ? (
          <div className="space-y-3">
            <div className="h-px w-full bg-border" />

            {/* Top 5 title with help tooltip */}
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Top 5 mặt hàng nguy cấp nhất
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Giải thích top 5 mặt hàng nguy cấp"
                  >
                    <HelpCircle className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                    5 mặt hàng nguy cấp nhất, sắp xếp theo số ngày tồn (DUS) tăng dần — DUS càng
                    thấp càng cần đặt hàng gấp. Bấm vào dòng để xem chi tiết dự báo.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Compact list */}
            <ul className="divide-y divide-border">
              {sortedCritical.map((sku) => (
                <li key={sku.sku_code}>
                  <button
                    type="button"
                    onClick={() => onSkuClick(sku)}
                    className="flex w-full items-center justify-between gap-4 py-2.5 text-left hover:bg-muted/50 transition-colors px-2 rounded-md"
                  >
                    <div className="min-w-0">
                      <span className="block font-mono text-sm font-medium text-foreground">
                        {sku.sku_code}
                      </span>
                      <span
                        className="block max-w-[320px] truncate text-xs text-muted-foreground"
                        title={sku.name}
                      >
                        {sku.name}
                      </span>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Tồn kho:</span>{" "}
                        <span className="tabular-nums text-foreground">
                          {sku.on_hand.toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">DUS:</span>{" "}
                        <span className={`tabular-nums ${dusColorClass(sku.dus)}`}>
                          {sku.dus !== null
                            ? `${sku.dus.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} ngày`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Không có mặt hàng nguy cấp 🎉
          </div>
        )}
      </CardContent>
    </Card>
  )
}

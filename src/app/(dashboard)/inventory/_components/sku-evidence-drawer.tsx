"use client"

import { useRouter } from "next/navigation"

import { useSkuEvidence } from "@/hooks/use-sku-evidence"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SkuEvidenceDrawerSkeleton } from "./sku-evidence-drawer-skeleton"
import { SkuEvidenceDrawerOnHand } from "./sku-evidence-drawer-on-hand"
import { SkuEvidenceDrawerForecast } from "./sku-evidence-drawer-forecast"
import { SkuEvidenceDrawerAlertGates } from "./sku-evidence-drawer-alert-gates"
import { SkuEvidenceDrawerSupplyBreakdown } from "./sku-evidence-drawer-supply-breakdown"
import { SkuEvidenceDrawerSuggestedPo } from "./sku-evidence-drawer-suggested-po"
import { STOCK_STATUS_LABELS } from "@/lib/stock-status-labels"
import type { InventoryStockStatus } from "@/types/inventory-evidence"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkuEvidenceDrawerProps {
  code: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Maps stock_status → Badge variant. Labels come from STOCK_STATUS_LABELS so
 *  list / drawer / detail stay in sync. Uses `stock_status` (threshold rule
 *  on closing_quantity vs minimum_stock), NOT alert severity — alert badge
 *  lives inside the "Cảnh báo" section below for DoS-based signals. */
const STOCK_STATUS_VARIANT: Record<InventoryStockStatus, "success" | "warning" | "destructive"> = {
  ok: "success",
  warn: "warning",
  critical: "destructive",
}

function stockStatusBadge(status: InventoryStockStatus) {
  return (
    <Badge variant={STOCK_STATUS_VARIANT[status] ?? "secondary"}>
      {STOCK_STATUS_LABELS[status] ?? status}
    </Badge>
  )
}

/** Section divider */
function Divider() {
  return <div className="h-px w-full bg-border" aria-hidden="true" />
}

/** Error state — distinguishes 403 / 404 / network */
function DrawerError({
  error,
  onRetry,
}: {
  error: Error
  onRetry: () => void
}) {
  let message = "Không thể tải dữ liệu. Vui lòng thử lại."
  const status = (error as unknown as { status?: number }).status
  if (status === 403) message = "Bạn không có quyền xem thông tin này."
  else if (status === 404) message = "Không tìm thấy dữ liệu cho mã SKU này."
  else if (!navigator.onLine) message = "Mất kết nối mạng. Vui lòng kiểm tra lại."

  return (
    <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {status !== 403 && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * SkuEvidenceDrawer — right-side Sheet showing 5-section evidence bundle for a SKU.
 * Opens when code is non-null. Fetches via useSkuEvidence hook (staleTime 30s).
 */
export function SkuEvidenceDrawer({ code, open, onOpenChange }: SkuEvidenceDrawerProps) {
  const router = useRouter()

  const { data, isLoading, isError, error, refetch } = useSkuEvidence(
    open ? code : null
  )

  // Find primary 30d forecast (fall back to first available)
  const forecast30d = data?.forecasts.find((f) => f.horizon_days === 30)
    ?? data?.forecasts[0]

  function handleViewDetail() {
    if (!code) return
    router.push(`/inventory/sku/${encodeURIComponent(code)}`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
        showCloseButton={false}
        data-testid="sku-evidence-drawer"
      >
        {/* ── Header ── */}
        <SheetHeader className="flex-row items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <SheetTitle className="shrink-0 font-mono text-base font-bold tracking-tight">
              {code ?? "—"}
            </SheetTitle>
            {data && stockStatusBadge(data.stock_status)}
          </div>
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => onOpenChange(false)}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && <SkuEvidenceDrawerSkeleton />}

          {isError && !isLoading && (
            <DrawerError
              error={error as Error}
              onRetry={() => refetch()}
            />
          )}

          {!isLoading && !isError && data && (
            <div className="flex flex-col">
              {/* Section 1 — On-hand */}
              <div data-testid="sku-evidence-drawer-section-tồn-kho">
                <SkuEvidenceDrawerOnHand onHand={data.on_hand} />
              </div>
              <Divider />

              {/* Section 2 — Forecast 30d */}
              {forecast30d && (
                <>
                  <div data-testid="sku-evidence-drawer-section-dự-báo-30-ngày">
                    <SkuEvidenceDrawerForecast forecast={forecast30d} />
                  </div>
                  <Divider />
                </>
              )}

              {/* Section 3 — Alert + gates */}
              <div data-testid="sku-evidence-drawer-section-cảnh-báo">
                <SkuEvidenceDrawerAlertGates
                  alert={data.alert}
                  onHand={data.on_hand}
                />
              </div>
              <Divider />

              {/* Section 4 — Supply breakdown */}
              <div data-testid="sku-evidence-drawer-section-cung-có-thể-bán">
                <SkuEvidenceDrawerSupplyBreakdown
                  supplyBreakdown={data.supply_breakdown}
                />
              </div>
              <Divider />

              {/* Section 5 — Suggested PO */}
              <div data-testid="sku-evidence-drawer-section-đề-xuất-đặt-hàng">
                <SkuEvidenceDrawerSuggestedPo suggestedPo={data.suggested_po} />
              </div>
            </div>
          )}

          {/* Empty state when no data after load */}
          {!isLoading && !isError && !data && (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu bằng chứng cho SKU này.
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-border px-5 py-4">
          <Button
            className="w-full"
            onClick={handleViewDetail}
            disabled={!code}
            data-testid="evidence-drawer-detail-button"
          >
            Xem chi tiết đầy đủ
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

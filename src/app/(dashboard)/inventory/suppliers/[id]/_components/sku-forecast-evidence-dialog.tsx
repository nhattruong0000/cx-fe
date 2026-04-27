"use client";

/**
 * SkuForecastEvidenceDialog — modal hiển thị bằng chứng dự báo cho 1 SKU.
 *
 * Refactored (Phase 02 V2 migration): thay 3-horizon table + forecast-evidence-utils
 * bằng ForecastActionCard (đã dùng evidence bundle native v2 fields).
 *
 * Layout:
 *   Header: SKU code + status badge + close X
 *   Body: ForecastActionCard (fetches evidence bundle internally via useSkuEvidence)
 *   Footer: Đóng + Xem chi tiết mặt hàng
 */

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useSkuEvidence } from "@/hooks/use-sku-evidence";
import type { StockStatus } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ForecastActionCard } from "@/app/(dashboard)/inventory/sku/[code]/_components/forecast-action-card";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SkuForecastEvidenceDialogProps {
  /** null = closed */
  skuCode: string | null;
  /** SKU display name passed from row to avoid extra fetch */
  skuName?: string;
  /** Stock status from parent row */
  stockStatus?: StockStatus;
  onClose: () => void;
}

// ─── Status badge helper ──────────────────────────────────────────────────────

function statusBadge(status?: StockStatus) {
  if (!status) return null;
  const map: Record<StockStatus, { label: string; variant: "success" | "warning" | "destructive" }> = {
    ok: { label: "Ổn định", variant: "success" },
    warn: { label: "Cảnh báo", variant: "warning" },
    critical: { label: "Nguy cấp", variant: "destructive" },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

export function SkuForecastEvidenceDialog({
  skuCode,
  skuName,
  stockStatus,
  onClose,
}: SkuForecastEvidenceDialogProps) {
  const router = useRouter();
  const open = !!skuCode;

  // Fetch evidence bundle (V2 native fields) — same hook used by SKU detail page
  const { data, isLoading, isError, refetch } = useSkuEvidence(open ? skuCode : null);

  function handleNavigateToSku() {
    if (!skuCode) return;
    onClose();
    router.push(`/inventory/sku/${encodeURIComponent(skuCode)}`);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[640px] gap-0 overflow-hidden rounded-[14px] p-0"
        aria-label={`Bằng chứng dự báo cho ${skuCode}`}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <DialogHeader className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="font-mono text-base font-bold leading-6 tracking-tight text-foreground">
                {skuCode ?? ""}
              </DialogTitle>
              {statusBadge(stockStatus)}
            </div>
            {skuName && (
              <p
                className="line-clamp-2 text-sm text-muted-foreground"
                title={skuName}
              >
                {skuName}
              </p>
            )}
          </DialogHeader>
          <button
            type="button"
            aria-label="Đóng hộp thoại"
            onClick={onClose}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" aria-label="Đang tải dữ liệu dự báo" />
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>Không thể tải dữ liệu dự báo. Vui lòng thử lại.</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => refetch()}
                  className="shrink-0"
                >
                  Thử lại
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Empty */}
          {!isLoading && !isError && !data && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu dự báo cho mặt hàng này.
            </p>
          )}

          {/* ForecastActionCard — uses V2 evidence bundle native fields */}
          {!isLoading && !isError && data && (
            <ForecastActionCard
              itemCode={data.item_code}
              stockCodes={data.on_hand.by_stock.map((s) => s.stock_code)}
              alert={data.alert}
              forecasts={data.forecasts}
              leadTime={data.lead_time}
              suggestedPo={data.suggested_po}
              reliability={data.reliability}
            />
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button
            onClick={handleNavigateToSku}
            disabled={!skuCode}
          >
            Xem chi tiết mặt hàng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

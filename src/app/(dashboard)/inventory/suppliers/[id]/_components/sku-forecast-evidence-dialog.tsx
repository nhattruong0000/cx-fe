"use client";

/**
 * SkuForecastEvidenceDialog — modal hiển thị bằng chứng dự báo cho 1 SKU.
 *
 * Layout (6 sections):
 *   1. Header: SKU code + status badge + close
 *   2. Dự báo 7/30/90 ngày (CSS bars, no chart lib)
 *   3. Phương pháp & độ tin cậy (2 chips)
 *   4. Gates đã trigger (bullet list, derived client-side)
 *   5. Tồn kho 7 ngày gần đây (MVP: current snapshot only)
 *   6. Lý do tóm tắt (derived Vietnamese paragraph)
 *   Footer: Đóng + Xem tại SKU chi tiết
 *
 * BE ForecastPoint fields used: horizon_days, qty_forecast, qty_lower,
 * qty_upper, method, low_confidence, created_at.
 * Fields NOT from BE (derived here): confidence label, gates, reasoning.
 */

import { HelpCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useSkuForecast } from "@/hooks/use-sku-forecast";
import type { ForecastPoint, StockStatus } from "@/types/inventory";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  deriveConfidenceLabel,
  deriveConfidenceRange,
  deriveGates,
  deriveReasoning,
  groupForecastsByHorizon,
} from "./forecast-evidence-utils";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SkuForecastEvidenceDialogProps {
  /** null = closed */
  skuCode: string | null;
  /** SKU display name passed from row to avoid extra fetch */
  skuName?: string;
  /** Current on-hand qty from row (used for gate derivation) */
  onHand?: number;
  /** Stock status from parent row */
  stockStatus?: StockStatus;
  /** Lead time P90 in days from parent context */
  leadTimeP90?: number | null;
  onClose: () => void;
}

// ─── Tooltip icon helper ──────────────────────────────────────────────────────

function HelpTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          aria-label="Thông tin thêm"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="size-4" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionTitle({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold text-foreground">{children}</span>
      <HelpTooltip content={tooltip} />
    </div>
  );
}

// ─── Section 2: Forecast bars ─────────────────────────────────────────────────

interface ForecastBarsProps {
  d7: ForecastPoint | undefined;
  d30: ForecastPoint | undefined;
  d90: ForecastPoint | undefined;
  isCritical: boolean;
}

function ForecastBars({ d7, d30, d90, isCritical }: ForecastBarsProps) {
  const points: Array<{ label: string; point: ForecastPoint | undefined; critical?: boolean }> = [
    { label: "7 ngày", point: d7 },
    { label: "30 ngày", point: d30 },
    { label: "90 ngày", point: d90, critical: isCritical },
  ];

  const maxQty = Math.max(
    d7?.qty_forecast ?? 0,
    d30?.qty_forecast ?? 0,
    d90?.qty_forecast ?? 0,
    1
  );

  return (
    <div className="flex flex-col gap-3">
      {points.map(({ label, point, critical }) => {
        const qty = point?.qty_forecast ?? 0;
        const pct = (qty / maxQty) * 100;
        const barColor = critical ? "bg-destructive/80" : "bg-primary/70";

        return (
          <div key={label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-sm text-muted-foreground">{label}</span>
            <div
              className="relative h-7 flex-1 overflow-hidden rounded-md bg-muted"
              role="meter"
              aria-label={`Dự báo ${label}: ${qty} cái`}
              aria-valuenow={qty}
              aria-valuemin={0}
              aria-valuemax={maxQty}
            >
              <div
                className={`absolute inset-y-0 left-0 transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums">
              {qty.toLocaleString("vi-VN")}
            </span>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground">đơn vị: cái</p>
    </div>
  );
}

// ─── Section 3: Method + confidence chips ─────────────────────────────────────

function MethodChips({
  method,
  lowConfidence,
  ciRange,
}: {
  method: string;
  lowConfidence: boolean;
  ciRange: string | null;
}) {
  const confidenceLabel = deriveConfidenceLabel(lowConfidence);
  const confidenceVariant = lowConfidence ? "warning" : "success";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Method chip */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Phương pháp</span>
        <Badge variant="outline" className="rounded-md px-2.5 py-1 text-xs font-medium">
          {method}
        </Badge>
      </div>

      {/* Confidence chip */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Độ tin cậy</span>
        <Badge variant={confidenceVariant} className="rounded-md px-2.5 py-1 text-xs font-medium">
          {confidenceLabel}
        </Badge>
      </div>

      {/* CI range (optional) */}
      {ciRange && (
        <p className="mt-auto text-xs text-muted-foreground">{ciRange}</p>
      )}
    </div>
  );
}

// ─── Section 4: Gates ─────────────────────────────────────────────────────────

function GatesList({ gates }: { gates: Array<{ key: string; message: string }> }) {
  if (gates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Không có cảnh báo đặc biệt.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5" aria-label="Danh sách cảnh báo">
      {gates.map((g) => (
        <li key={g.key} className="flex items-start gap-2 text-sm">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" aria-hidden="true" />
          <span className="text-foreground">{g.message}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Section 5: Stock snapshot ────────────────────────────────────────────────

function StockSnapshot({
  onHand,
  updatedAt,
}: {
  onHand?: number;
  updatedAt?: string;
}) {
  if (onHand == null) {
    return <p className="text-sm text-muted-foreground">Không có dữ liệu tồn kho.</p>;
  }

  // Compute minutes ago from latest forecast created_at
  let minutesAgo: string | null = null;
  if (updatedAt) {
    const diff = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 60_000);
    minutesAgo = diff < 1 ? "vừa xong" : `${diff} phút trước`;
  }

  return (
    <p className="text-sm text-foreground">
      Tồn hiện tại:{" "}
      <span className="font-semibold">{onHand.toLocaleString("vi-VN")} cái</span>
      {minutesAgo && (
        <span className="text-muted-foreground"> · cập nhật {minutesAgo}</span>
      )}
    </p>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="h-px w-full bg-border" aria-hidden="true" />;
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
  onHand,
  stockStatus,
  leadTimeP90,
  onClose,
}: SkuForecastEvidenceDialogProps) {
  const router = useRouter();
  const open = !!skuCode;

  const { data, isLoading, isError, refetch } = useSkuForecast(skuCode);

  // Derived state (only when data available)
  const grouped = data ? groupForecastsByHorizon(data.data) : null;
  const { d7, d30, d90 } = grouped ?? {};

  // Confidence from first available point (prefer 30d)
  const primaryPoint = d30 ?? d7 ?? d90;
  const ciRange = primaryPoint ? deriveConfidenceRange(primaryPoint) : null;

  const gates = deriveGates({ onHand, d30, leadTimeP90 });

  const reasoning = data
    ? deriveReasoning({ status: stockStatus, onHand, d7, d30, leadTimeP90 })
    : null;

  const latestCreatedAt = primaryPoint?.created_at;

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
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" aria-label="Đang tải dữ liệu dự báo" />
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="p-6">
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
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && data && data.data.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu dự báo cho mặt hàng này.
            </div>
          )}

          {/* Content */}
          {!isLoading && !isError && data && data.data.length > 0 && (
            <div className="flex flex-col">
              {/* Section 2: Forecast bars */}
              <section className="px-6 py-5" aria-labelledby="section-forecast">
                <SectionTitle
                  tooltip="Số lượng ước tính sẽ tiêu thụ trong 7, 30 và 90 ngày tới."
                >
                  Dự báo 7 / 30 / 90 ngày
                </SectionTitle>
                <div className="mt-4">
                  <ForecastBars
                    d7={d7}
                    d30={d30}
                    d90={d90}
                    isCritical={stockStatus === "critical"}
                  />
                </div>
              </section>

              <Divider />

              {/* Section 3: Method + confidence */}
              {primaryPoint && (
                <>
                  <section className="px-6 py-5" aria-labelledby="section-method">
                    <SectionTitle
                      tooltip="Phương pháp thống kê được chọn tự động dựa trên độ chính xác lịch sử. Độ tin cậy càng cao càng nên tin vào con số dự báo."
                    >
                      Phương pháp &amp; độ tin cậy
                    </SectionTitle>
                    <div className="mt-3">
                      <MethodChips
                        method={primaryPoint.method}
                        lowConfidence={primaryPoint.low_confidence}
                        ciRange={ciRange}
                      />
                    </div>
                  </section>
                  <Divider />
                </>
              )}

              {/* Section 4: Gates */}
              <section className="px-6 py-5" aria-labelledby="section-gates">
                <SectionTitle
                  tooltip="Các điều kiện đã kích hoạt cảnh báo — ví dụ tồn kho không đủ cho thời gian chờ giao hàng."
                >
                  Cảnh báo đã kích hoạt
                </SectionTitle>
                <div className="mt-3">
                  <GatesList gates={gates} />
                </div>
              </section>

              <Divider />

              {/* Section 5: Stock snapshot */}
              <section className="px-6 py-5" aria-labelledby="section-history">
                <SectionTitle
                  tooltip="Tồn kho mỗi ngày trong 7 ngày gần nhất. Xanh là ổn định, vàng là đang giảm, đỏ là gần cạn hoặc đã hết."
                >
                  Tồn kho 7 ngày gần đây
                </SectionTitle>
                <div className="mt-3">
                  <StockSnapshot onHand={onHand} updatedAt={latestCreatedAt} />
                </div>
              </section>

              <Divider />

              {/* Section 6: Reasoning */}
              <section className="px-6 py-5" aria-labelledby="section-reasoning">
                <SectionTitle
                  tooltip="Tóm tắt dễ hiểu vì sao mặt hàng đang ở tình trạng này, giúp bộ phận mua hàng ra quyết định nhanh."
                >
                  Lý do tóm tắt
                </SectionTitle>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  {reasoning ?? "—"}
                </p>
              </section>
            </div>
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

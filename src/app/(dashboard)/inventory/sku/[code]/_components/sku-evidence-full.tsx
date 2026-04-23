"use client";

/**
 * SkuEvidenceFull — main container for the SKU detail page.
 * Fetches evidence via useSkuEvidence, renders page header, tabs, and tab content.
 */

import Link from "next/link";
import { ArrowLeft, RefreshCw, Download } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSkuEvidence } from "@/hooks/use-sku-evidence";
import { SkuEvidenceFullSkeleton } from "./sku-evidence-full-skeleton";
import { EvidenceTabOverview } from "./evidence-tab-overview";
import { EvidenceTabForecast } from "./evidence-tab-forecast";
import { EvidenceTabLeadTime } from "./evidence-tab-lead-time";
import { EvidenceTabPurchaseOrders } from "./evidence-tab-purchase-orders";
import { EvidenceTabReliability } from "./evidence-tab-reliability";
import { ForecastStrategyBadge } from "./forecast-strategy-badge";

interface SkuEvidenceFullProps {
  code: string;
}

// Labels must match STOCK_STATUS_LABELS used on the list page so all three
// views (list, drawer, detail) show identical text for the same stock_status.
const STATUS_BADGE: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  ok: { label: "Ổn định", variant: "success" },
  warn: { label: "Cảnh báo", variant: "warning" },
  critical: { label: "Nguy cấp", variant: "destructive" },
};

export function SkuEvidenceFull({ code }: SkuEvidenceFullProps) {
  const queryClient = useQueryClient();
  const { data: evidence, isLoading, error } = useSkuEvidence(code);

  function handleRefresh() {
    void queryClient.invalidateQueries({
      queryKey: ["inventory", "items", code, "evidence"],
    });
  }

  if (isLoading) return <SkuEvidenceFullSkeleton />;

  if (error) {
    const status = (error as { status?: number }).status;
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/inventory"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          data-testid="evidence-error-back-button"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center" data-testid="evidence-error-404">
          <p className="font-medium text-destructive">
            {status === 404
              ? `Không tìm thấy SKU "${code}".`
              : status === 403
              ? "Bạn không có quyền xem thông tin này."
              : "Không tải được dữ liệu. Vui lòng thử lại."}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={handleRefresh}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!evidence) return null;

  const statusCfg = STATUS_BADGE[evidence.stock_status] ?? { label: evidence.stock_status, variant: "secondary" as const };
  const primaryBranch = evidence.on_hand.by_stock[0];
  const info = evidence.item_info;
  const vendorDisplay = info?.vendor_name
    ? info.vendor_code
      ? `${info.vendor_name} (${info.vendor_code})`
      : info.vendor_name
    : info?.vendor_code ?? null;
  const categoryDisplay = info?.category_name
    ? info.category_code
      ? `${info.category_name} (${info.category_code})`
      : info.category_name
    : info?.category_code ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/inventory"
            className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Quay lại danh sách tồn kho"
            data-testid="evidence-detail-back-button"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{code}</h1>
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            <ForecastStrategyBadge strategy={evidence.reliability?.forecast_strategy} />
          </div>
          {info?.item_name && (
            <p className="text-base font-medium text-foreground" data-testid="evidence-item-name">
              {info.item_name}
            </p>
          )}
          <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-cols-[auto_auto_auto]">
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground/70">Kho:</dt>
              <dd data-testid="evidence-stock-info">
                {primaryBranch?.stock_name ?? "—"}
                {primaryBranch?.stock_code && (
                  <span className="ml-1 text-muted-foreground/60">· {primaryBranch.stock_code}</span>
                )}
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground/70">Nhóm sản phẩm:</dt>
              <dd data-testid="evidence-category-info">{categoryDisplay ?? "—"}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground/70">Nhà cung cấp:</dt>
              <dd data-testid="evidence-vendor-info">{vendorDisplay ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            aria-label="Làm mới dữ liệu"
            className="gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            Làm mới
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              // Export report — stub for future implementation
              alert("Tính năng xuất báo cáo đang được phát triển.");
            }}
            aria-label="Xuất báo cáo"
          >
            <Download className="size-3.5" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start" aria-label="Các mục xem chi tiết SKU">
          <TabsTrigger value="overview" data-testid="sku-evidence-tab-tổng-quan">Tổng quan</TabsTrigger>
          <TabsTrigger value="forecast" data-testid="sku-evidence-tab-dự-báo">Dự báo</TabsTrigger>
          <TabsTrigger value="lead-time" data-testid="sku-evidence-tab-thời-gian-giao">Thời gian giao</TabsTrigger>
          <TabsTrigger value="purchase-orders" data-testid="sku-evidence-tab-đơn-đặt-hàng">Đơn đặt hàng</TabsTrigger>
          <TabsTrigger value="reliability" data-testid="sku-evidence-tab-độ-tin-cậy">Độ tin cậy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" data-testid="evidence-tab-content-tổng-quan">
          <EvidenceTabOverview evidence={evidence} />
        </TabsContent>

        <TabsContent value="forecast" data-testid="evidence-tab-content-dự-báo">
          <EvidenceTabForecast evidence={evidence} />
        </TabsContent>

        <TabsContent value="lead-time" data-testid="evidence-tab-content-thời-gian-giao">
          <EvidenceTabLeadTime evidence={evidence} />
        </TabsContent>

        <TabsContent value="purchase-orders" data-testid="evidence-tab-content-đơn-đặt-hàng">
          <EvidenceTabPurchaseOrders evidence={evidence} />
        </TabsContent>

        <TabsContent value="reliability" data-testid="evidence-tab-content-độ-tin-cậy">
          <EvidenceTabReliability evidence={evidence} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

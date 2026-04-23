"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { useSupplierDetail } from "@/hooks/use-supplier-detail"
import type { StockStatus, SupplierSkuItem } from "@/types/inventory"
import { SupplierHeaderCard } from "./_components/supplier-header-card"
import { SupplierMetricsGrid } from "./_components/supplier-metrics-grid"
import { SupplierRiskBreakdown } from "./_components/supplier-risk-breakdown"
import { SupplierSkusTable } from "./_components/supplier-skus-table"
import { SkuForecastEvidenceDialog } from "./_components/sku-forecast-evidence-dialog"

/** Minimal context to drive the forecast evidence modal */
interface SelectedSkuContext {
  skuCode: string
  skuName?: string
  onHand?: number
  stockStatus?: StockStatus
}

/** Skeleton shown while detail is loading */
function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
      <div className="h-40 animate-pulse rounded-[14px] bg-muted" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-[14px] bg-muted" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-[14px] bg-muted" />
      <div className="h-96 animate-pulse rounded-[14px] bg-muted" />
    </div>
  )
}

/** Error state with retry link */
function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-sm text-muted-foreground">
        Không thể tải thông tin nhà cung cấp.
      </p>
      <Link
        href="/inventory/suppliers"
        className="inline-flex h-9 items-center rounded-[10px] border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        Quay lại danh sách
      </Link>
    </div>
  )
}

/** Supplier detail page — orchestrates header + metrics + risk + SKU table */
export default function InventorySupplierDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id ?? ""

  // selectedSku drives the forecast evidence modal
  const [selectedSku, setSelectedSku] = React.useState<SelectedSkuContext | null>(null)

  const { data: detail, isLoading, isError } = useSupplierDetail(id)

  if (isError) return <ErrorState />
  if (isLoading || !detail) return <DetailSkeleton />

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/inventory" className="hover:text-foreground transition-colors">
          Kho
        </Link>
        <ChevronRight className="size-4" />
        <Link href="/inventory/suppliers" className="hover:text-foreground transition-colors">
          Nhà cung cấp
        </Link>
        <ChevronRight className="size-4" />
        <span className="font-mono font-medium text-foreground">{detail.code}</span>
      </nav>

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Chi tiết nhà cung cấp</h1>
      </div>

      {/* Header card: code + name + status + contact + meta */}
      <SupplierHeaderCard detail={detail} />

      {/* 4 KPI metric cards */}
      <SupplierMetricsGrid metrics={detail.metrics} />

      {/* Risk pill row + top-5 critical list */}
      <SupplierRiskBreakdown
        riskCounts={detail.risk_counts}
        topCritical={detail.top_5_critical}
        onSkuClick={(sku) =>
          setSelectedSku({
            skuCode: sku.sku_code,
            skuName: sku.name,
            onHand: sku.on_hand,
            stockStatus: "critical",
          })
        }
      />

      {/* Paginated SKU table with search + status filter */}
      <SupplierSkusTable
        supplierId={id}
        onRowClick={(row: SupplierSkuItem) =>
          setSelectedSku({
            skuCode: row.sku_code,
            skuName: row.name,
            onHand: row.on_hand,
            stockStatus: row.status,
          })
        }
      />

      {/* Forecast evidence modal — triggered by SKU row click or top-5 list */}
      <SkuForecastEvidenceDialog
        skuCode={selectedSku?.skuCode ?? null}
        skuName={selectedSku?.skuName}
        onHand={selectedSku?.onHand}
        stockStatus={selectedSku?.stockStatus}
        leadTimeP90={detail.lead_time_p90_days}
        onClose={() => setSelectedSku(null)}
      />
    </div>
  )
}

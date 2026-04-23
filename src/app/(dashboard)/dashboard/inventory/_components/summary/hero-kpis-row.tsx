"use client";

// Row 1: 4 hero KPI stat cards driven by useInventoryDashboardSummary.
// Variants + deltas match design .pen frame (K26fm row).

import { AlertCircle, AlertTriangle, RefreshCw, Truck } from "lucide-react";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";
import { formatPct } from "./derive-helpers";
import { KpiStatCard } from "./kpi-stat-card";
import { KpiTooltipContent } from "./kpi-tooltip-content";

export function HeroKpisRow() {
  const { data, isLoading, isError } = useInventoryDashboardSummary();
  const kpis = data?.hero_kpis;
  const err = isError ? "Không tải được" : undefined;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiStatCard
        label="SKU có cảnh báo mở"
        value={kpis?.open_alerts_sku_count ?? "—"}
        tooltipContent={<KpiTooltipContent metric="open_alerts_sku" />}
        icon={AlertCircle}
        variant="primary"
        delta="trên tổng SKU theo dõi"
        isLoading={isLoading}
        error={err}
      />
      <KpiStatCard
        label="Cảnh báo nghiêm trọng"
        value={kpis?.critical_alerts_count ?? "—"}
        tooltipContent={<KpiTooltipContent metric="critical_alerts" />}
        icon={AlertTriangle}
        variant="destructive"
        delta="Cần xử lý ngay"
        isLoading={isLoading}
        error={err}
      />
      <KpiStatCard
        label="PO quá hạn"
        value={kpis?.overdue_po_count ?? "—"}
        tooltipContent={<KpiTooltipContent metric="overdue_po" />}
        icon={Truck}
        variant="warning"
        delta="Quá ETA"
        isLoading={isLoading}
        error={err}
      />
      <KpiStatCard
        label="% SKU cần reorder"
        value={kpis != null ? formatPct(kpis.reorder_needed_pct) : "—"}
        tooltipContent={<KpiTooltipContent metric="reorder_pct" />}
        icon={RefreshCw}
        variant="success"
        delta="trên tổng SKU theo dõi"
        isLoading={isLoading}
        error={err}
      />
    </div>
  );
}

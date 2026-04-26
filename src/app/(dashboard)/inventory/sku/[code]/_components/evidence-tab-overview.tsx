"use client";

/**
 * Overview tab — stat cards row + charts row + alert/supply/PO row + reliability/overdue/lead-time row.
 */

import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { WeeklyHistoryChart } from "./weekly-history-chart";
import { ForecastActionCard } from "./forecast-action-card";
import { AlertCard } from "./alert-card";
import { SupplyBreakdownCard } from "./supply-breakdown-card";
import { SuggestedPoCard } from "./suggested-po-card";
import { ReliabilityGauge } from "./reliability-gauge";
import { OverduePosTable } from "./overdue-pos-table";
import { LeadTimeCard } from "./lead-time-card";
import type { InventoryEvidenceBundle } from "@/types/inventory-evidence";

interface EvidenceTabOverviewProps {
  evidence: InventoryEvidenceBundle;
}

/** Formats synced_at ISO string into relative age label */
function syncAge(syncedAt: string | null): string {
  if (!syncedAt) return "Chưa đồng bộ";
  const diffMs = Date.now() - new Date(syncedAt).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.floor(hrs / 24)} ngày trước`;
}

export function EvidenceTabOverview({ evidence }: EvidenceTabOverviewProps) {
  const { on_hand, alert, forecasts, supply_breakdown, suggested_po, reliability, weekly_history, purchase_orders, lead_time } = evidence;
  const forecast30 = forecasts.find((f) => f.horizon_days === 30);
  const dosValue = alert.dos;
  /** dos < 1 → imminent stockout — highest severity tier */
  const dosCritical = dosValue !== null && dosValue < 1;
  /** 1 ≤ dos < 7 → warning tier */
  const dosDanger = dosValue !== null && dosValue < 7;

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1 — 4 stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* On-hand */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Tồn kho thực tế
              <HelpTooltip>Lượng hàng thực tế đang có trong kho, đồng bộ từ hệ thống AMIS.</HelpTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{on_hand.total.toLocaleString("vi-VN")}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {on_hand.source} · {syncAge(on_hand.synced_at)}
            </p>
          </CardContent>
        </Card>

        {/* Daily demand */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Nhu cầu mỗi ngày
              <HelpTooltip>Nhu cầu trung bình mỗi ngày, tính từ dự báo 30 ngày chia đều.</HelpTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {alert.demand_daily?.toLocaleString("vi-VN", { maximumFractionDigits: 1 }) ?? "—"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">TB dự báo 30 ngày</p>
          </CardContent>
        </Card>

        {/* Days of stock */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Số ngày tồn còn lại
              <HelpTooltip>
                Ước tính số ngày hàng còn đủ bán = tồn kho hiện tại / nhu cầu dự báo.
                {dosValue === null ? " Dự báo quá cũ, không tính được DoS." : null}
                {alert.dos_at_detection != null && ` Giá trị lúc phát hiện alert: ${alert.dos_at_detection.toFixed(2)}.`}
                {alert.demand_stale_days != null && alert.demand_stale_days > 0 && ` Dự báo cũ ${alert.demand_stale_days} ngày.`}
              </HelpTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              data-testid="dos-value"
              data-dos-tier={dosCritical ? "critical" : dosDanger ? "danger" : "normal"}
              className={`text-2xl font-bold ${dosCritical || dosDanger ? "text-destructive" : "text-foreground"}`}
            >
              {dosValue?.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) ?? "—"}
            </p>
            <p
              data-testid="dos-label"
              className={`mt-0.5 text-xs ${dosCritical ? "font-semibold text-destructive" : "text-muted-foreground"}`}
            >
              {dosCritical ? "Sắp hết hàng — đặt PO khẩn"
                : dosDanger ? "Dưới ngưỡng 7 ngày — cần đặt hàng"
                : "Ngưỡng cảnh báo: 7 ngày"}
            </p>
          </CardContent>
        </Card>

        {/* Forecast 30d */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Dự báo 30 ngày
              <HelpTooltip>Lượng hàng dự kiến sẽ bán trong 30 ngày tới, kèm khoảng dao động tin cậy.</HelpTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p data-testid="forecast-30d-value" className="text-2xl font-bold text-foreground">
              {forecast30?.qty_forecast != null ? Math.round(forecast30.qty_forecast).toLocaleString("vi-VN") : "—"}
            </p>
            {forecast30?.qty_forecast != null && (forecast30.stale_days ?? 0) > 1 && (
              <p data-testid="forecast-stale-badge" className="mt-0.5 text-xs text-amber-600">
                Dự báo cũ {forecast30.stale_days} ngày
              </p>
            )}
            {forecast30?.ci_low != null && forecast30?.ci_high != null && (forecast30.stale_days ?? 0) <= 1 && (
              <p className="mt-0.5 text-xs text-info">
                Dao động ±{Math.round((forecast30.ci_high - forecast30.ci_low) / 2).toLocaleString("vi-VN")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <RefreshCw className="size-3.5 text-muted-foreground" />
              Lịch sử bán hàng theo tuần
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyHistoryChart data={weekly_history} />
          </CardContent>
        </Card>
        <ForecastActionCard
          itemCode={evidence.item_code}
          stockCodes={on_hand.by_stock.map((s) => s.stock_code)}
          alert={alert}
          forecasts={forecasts}
          leadTime={lead_time}
          suggestedPo={suggested_po}
          reliability={reliability}
        />
      </div>

      {/* Row 3 — Alert / Supply / Suggested PO */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AlertCard alert={alert} onHand={on_hand} />
        <SupplyBreakdownCard supply={supply_breakdown} />
        <SuggestedPoCard suggestedPo={suggested_po} />
      </div>

      {/* Row 4 — Reliability / Overdue POs / Lead Time */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ReliabilityGauge reliability={reliability} />
        <OverduePosTable
          overdue={purchase_orders.overdue_list}
          expediting={purchase_orders.expediting_priority}
        />
        <LeadTimeCard leadTime={lead_time} />
      </div>
    </div>
  );
}

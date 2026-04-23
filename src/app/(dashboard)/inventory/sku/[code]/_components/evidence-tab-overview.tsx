"use client";

/**
 * Overview tab — stat cards row + charts row + alert/supply/PO row + reliability/overdue/lead-time row.
 */

import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { WeeklyHistoryChart } from "./weekly-history-chart";
import { ForecastCiChart } from "./forecast-ci-chart";
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
  const dosDanger = alert.dos !== null && alert.dos < 7;

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
              <HelpTooltip>Nhu cầu trung bình mỗi ngày tính theo phương pháp trung bình trượt 30 ngày gần nhất.</HelpTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {alert.demand_daily?.toLocaleString("vi-VN", { maximumFractionDigits: 1 }) ?? "—"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Trung bình trượt · 30 ngày</p>
          </CardContent>
        </Card>

        {/* Days of stock */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Số ngày tồn còn lại
              <HelpTooltip>Ước tính số ngày hàng còn đủ bán dựa trên tốc độ tiêu thụ hiện tại. Ngưỡng cảnh báo: dưới 7 ngày.</HelpTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${dosDanger ? "text-destructive" : "text-foreground"}`}>
              {alert.dos?.toLocaleString("vi-VN") ?? "—"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {dosDanger ? "Dưới ngưỡng 7 ngày — cần đặt hàng" : "Ngưỡng cảnh báo: 7 ngày"}
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
            <p className="text-2xl font-bold text-foreground">
              {forecast30?.qty_forecast?.toLocaleString("vi-VN") ?? "—"}
            </p>
            {forecast30?.ci_low != null && forecast30?.ci_high != null && (
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              Dự báo theo khoảng thời gian
              <HelpTooltip>Ba mức dự báo 7, 30 và 90 ngày với khoảng dao động kỳ vọng.</HelpTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastCiChart forecasts={forecasts} />
          </CardContent>
        </Card>
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

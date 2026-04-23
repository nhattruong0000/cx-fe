"use client";

/**
 * Forecast tab — detailed view of all forecast horizons with CI chart
 * and method explanation.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { WeeklyHistoryChart } from "./weekly-history-chart";
import { ForecastCiChart } from "./forecast-ci-chart";
import type { InventoryEvidenceBundle } from "@/types/inventory-evidence";

interface EvidenceTabForecastProps {
  evidence: InventoryEvidenceBundle;
}

const METHOD_LABEL: Record<string, { label: string; desc: string }> = {
  ewma: {
    label: "Trung bình trượt có trọng số",
    desc: "Ưu tiên dữ liệu gần đây hơn, phù hợp với nhu cầu biến động nhẹ.",
  },
  moving_average: {
    label: "Trung bình trượt đơn giản",
    desc: "Tính trung bình đều các tuần gần đây, phù hợp với nhu cầu ổn định.",
  },
  fallback: {
    label: "Dự phòng",
    desc: "Sử dụng ước tính đơn giản do thiếu dữ liệu lịch sử.",
  },
};

export function EvidenceTabForecast({ evidence }: EvidenceTabForecastProps) {
  const { forecasts, weekly_history } = evidence;
  const primaryForecast = forecasts[0];
  const method = primaryForecast?.method ?? "moving_average";
  const methodCfg = METHOD_LABEL[method] ?? { label: method, desc: "" };

  return (
    <div className="flex flex-col gap-6">
      {/* Method explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            Phương pháp dự báo
            <HelpTooltip>
              Hệ thống tự động chọn phương pháp phù hợp dựa trên độ tin cậy và lịch sử dữ liệu.
            </HelpTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{methodCfg.label}</Badge>
          </div>
          {methodCfg.desc && (
            <p className="text-sm text-muted-foreground">{methodCfg.desc}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Ngày dự báo: {new Date(evidence.forecast_date).toLocaleDateString("vi-VN")}
          </p>
        </CardContent>
      </Card>

      {/* Forecast CI cards — all horizons */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Dự báo theo khoảng thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastCiChart forecasts={forecasts} />
          </CardContent>
        </Card>

        {/* Detailed forecast table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chi tiết dự báo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-4 border-b border-border pb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>Kỳ hạn</span>
                <span className="text-right">Dự báo</span>
                <span className="text-right">Thấp nhất</span>
                <span className="text-right">Cao nhất</span>
              </div>
              {forecasts.map((f, i) => (
                <div
                  key={f.horizon_days ?? `forecast-row-${i}`}
                  className="grid grid-cols-4 items-center border-b border-border/40 py-2.5 text-xs last:border-0"
                >
                  <span className="font-medium text-foreground">{f.horizon_days} ngày</span>
                  <span className="text-right font-semibold text-foreground">
                    {f.qty_forecast?.toLocaleString("vi-VN") ?? "—"}
                  </span>
                  <span className="text-right text-muted-foreground">
                    {f.ci_low?.toLocaleString("vi-VN") ?? "—"}
                  </span>
                  <span className="text-right text-muted-foreground">
                    {f.ci_high?.toLocaleString("vi-VN") ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly history chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Lịch sử bán hàng 12 tuần</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyHistoryChart data={weekly_history} />
        </CardContent>
      </Card>
    </div>
  );
}

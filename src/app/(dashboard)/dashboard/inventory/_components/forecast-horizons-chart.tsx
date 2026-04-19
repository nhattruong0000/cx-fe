"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForecast } from "../_hooks/use-forecast";
import { useInventoryDashboardStore } from "../_store/inventory-dashboard-store";
import { CHART_COLORS } from "@/lib/dashboard-chart-colors";

interface ChartRow {
  date: string;
  h7?: number;
  h30?: number;
  h90?: number;
  lower?: number;
  upper?: number;
}

function normalizeKey(horizon: number): "h7" | "h30" | "h90" | null {
  if (horizon === 7) return "h7";
  if (horizon === 30) return "h30";
  if (horizon === 90) return "h90";
  return null;
}

export function ForecastHorizonsChart() {
  const { selectedSku, branchFilter } = useInventoryDashboardStore();

  const { data, isLoading } = useForecast(selectedSku, {
    horizons: [7, 30, 90],
    branch_id: branchFilter ?? undefined,
  });

  const { rows, method, lowConfidence } = useMemo(() => {
    const points = data?.data ?? [];
    const map = new Map<string, ChartRow>();
    for (const p of points) {
      const key = normalizeKey(p.horizon_days);
      if (!key) continue;
      const row = map.get(p.forecast_date) ?? { date: p.forecast_date };
      row[key] = p.qty_forecast;
      if (p.horizon_days === 30) {
        if (p.qty_lower !== null) row.lower = p.qty_lower;
        if (p.qty_upper !== null) row.upper = p.qty_upper;
      }
      map.set(p.forecast_date, row);
    }
    const rows = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
    const latest = points[0];
    return {
      rows,
      method: latest?.method ?? null,
      lowConfidence: Boolean(latest?.low_confidence),
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dự báo nhu cầu (7/30/90d)</CardTitle>
          {method && (
            <div className="flex items-center gap-1">
              <Badge variant="outline">{method}</Badge>
              {lowConfidence && <Badge variant="warning">Độ tin cậy thấp</Badge>}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {selectedSku ? `SKU: ${selectedSku}` : "Chọn SKU từ lưới để xem dự báo"}
        </p>
      </CardHeader>
      <CardContent>
        {!selectedSku && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Chưa chọn SKU.
          </p>
        )}
        {selectedSku && isLoading && (
          <p className="py-8 text-sm text-muted-foreground">Đang tải dự báo…</p>
        )}
        {selectedSku && !isLoading && rows.length === 0 && (
          <p className="py-8 text-sm text-muted-foreground">Không có dữ liệu dự báo.</p>
        )}
        {selectedSku && rows.length > 0 && (
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill={CHART_COLORS[1]}
                fillOpacity={0.15}
                name="Khoảng tin cậy trên"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1}
                name="Khoảng tin cậy dưới"
              />
              <Line
                type="monotone"
                dataKey="h7"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                name="7 ngày"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="h30"
                stroke={CHART_COLORS[1]}
                strokeWidth={2}
                name="30 ngày"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="h90"
                stroke={CHART_COLORS[2]}
                strokeWidth={2}
                name="90 ngày"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

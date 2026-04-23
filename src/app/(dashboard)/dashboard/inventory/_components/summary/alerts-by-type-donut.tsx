"use client";

// Recharts PieChart showing alerts breakdown by type from dashboard summary.

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";

// Semantic palette: severity-aware distinct colors cho 8 alert types.
// Ưu tiên visual hierarchy: red=critical, orange=warning, neutral=info.
const ALERT_TYPE_COLORS: Record<string, string> = {
  stockout:          "#DC2626", // red-600 — Hết hàng (critical)
  restock_overdue:   "#B91C1C", // red-700 — Restock quá hạn
  po_overdue:        "#EA580C", // orange-600 — PO quá hạn
  reorder:           "#F59E0B", // amber-500 — Cần đặt hàng
  transfer_pressure: "#F97316", // orange-500 — Áp lực điều chuyển
  anomaly:           "#8B5CF6", // violet-500 — Bất thường
  overstock:         "#2556C5", // blue-700 — Tồn kho dư
  po_stale:          "#64748B", // slate-500 — PO cũ
};
const FALLBACK_COLOR = "#94A3B8"; // slate-400

export function AlertsByTypeDonut() {
  const { data, isLoading, isError } = useInventoryDashboardSummary();
  const items = data?.breakdown.alerts_by_type ?? [];

  const chartData = items
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.label_vi,
      value: item.count,
      color: ALERT_TYPE_COLORS[item.type] ?? FALLBACK_COLOR,
    }));

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Alerts theo loại</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="h-[180px] animate-pulse rounded bg-muted" />
        )}
        {!isLoading && isError && (
          <p className="py-6 text-xs text-destructive">Không tải được dữ liệu.</p>
        )}
        {!isLoading && !isError && chartData.length === 0 && (
          <p className="py-6 text-xs text-muted-foreground">Không có cảnh báo.</p>
        )}
        {!isLoading && !isError && chartData.length > 0 && (
          // minWidth prevents ResponsiveContainer SSR/hydration zero-width fallback
          // that causes the donut to render as a legend chip strip.
          <div style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    typeof value === "number"
                      ? value.toLocaleString("vi-VN")
                      : value,
                  ]}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

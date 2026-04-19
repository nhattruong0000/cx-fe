"use client";

import { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryAlerts } from "../_hooks/use-inventory-alerts";
import { useInventoryDashboardStore } from "../_store/inventory-dashboard-store";
import { CHART_COLORS } from "@/lib/dashboard-chart-colors";
import { alertTypeLabel, severityLabel } from "./inventory-format-utils";

type Entry = { name: string; value: number; key: string };

function countBy<T>(items: T[], pick: (x: T) => string): Entry[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = pick(it);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([key, value]) => ({
    key,
    value,
    name: key,
  }));
}

export function AlertSummaryDonut() {
  const { branchFilter, setAlertTypeFilter, setSeverityFilter } =
    useInventoryDashboardStore();

  const { data, isLoading } = useInventoryAlerts({
    status: "open",
    per_page: 200,
    branch_id: branchFilter ?? undefined,
  });

  const { byType, bySeverity } = useMemo(() => {
    const alerts = data?.data ?? [];
    return {
      byType: countBy(alerts, (a) => a.alert_type).map((e) => ({
        ...e,
        name: alertTypeLabel(e.key),
      })),
      bySeverity: countBy(alerts, (a) => a.severity).map((e) => ({
        ...e,
        name: severityLabel(e.key),
      })),
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng hợp cảnh báo</CardTitle>
        <p className="text-xs text-muted-foreground">Chia theo loại & mức độ</p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="py-6 text-sm text-muted-foreground">Đang tải…</p>
        )}
        {!isLoading && byType.length === 0 && (
          <p className="py-6 text-sm text-muted-foreground">
            Không có cảnh báo đang mở.
          </p>
        )}
        {!isLoading && byType.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1 text-center text-xs text-muted-foreground">Theo loại</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={byType}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={2}
                    onClick={(e: { payload?: Entry }) =>
                      e?.payload && setAlertTypeFilter(e.payload.key)
                    }
                  >
                    {byType.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="mb-1 text-center text-xs text-muted-foreground">
                Theo mức độ
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={bySeverity}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={2}
                    onClick={(e: { payload?: Entry }) =>
                      e?.payload && setSeverityFilter(e.payload.key)
                    }
                  >
                    {bySeverity.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

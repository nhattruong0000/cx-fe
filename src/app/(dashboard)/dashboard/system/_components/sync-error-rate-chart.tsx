"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/dashboard-chart-colors";
import { useOpsSyncStatus } from "../_hooks/use-ops-sync-status";

const CLASSIFICATION_LABEL: Record<string, string> = {
  token_expired: "Token hết hạn",
  rate_limit: "Giới hạn tốc độ",
  network: "Mạng",
  proxy_exhausted: "Hết proxy",
};

export function SyncErrorRateChart() {
  const { data, isLoading, error } = useOpsSyncStatus();

  const { failures, discards } = useMemo(() => {
    const errs = data?.errors;
    const failures = errs
      ? Object.entries(errs.consecutive_failures_by_job).map(([job, count]) => ({
          job: job.replace(/^AmisSync|Job$/g, ""),
          count,
        }))
      : [];
    const discards = errs
      ? Object.entries(errs.discards_24h_by_classification)
          .filter(([, v]) => v > 0)
          .map(([key, value]) => ({
            key,
            name: CLASSIFICATION_LABEL[key] ?? key,
            value,
          }))
      : [];
    return { failures, discards };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tỉ lệ lỗi đồng bộ</CardTitle>
        <p className="text-xs text-muted-foreground">
          Consecutive failures theo job · discards 24h theo phân loại
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && !data && (
          <p className="py-4 text-sm text-muted-foreground">Đang tải…</p>
        )}
        {error && (
          <p className="py-4 text-sm text-red-600">Không tải được dữ liệu.</p>
        )}
        {data && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-center text-xs text-muted-foreground">
                Consecutive failures
              </p>
              {failures.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Không có job lỗi.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={failures}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="job" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill={CHART_COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div>
              <p className="mb-1 text-center text-xs text-muted-foreground">
                Discards 24h
              </p>
              {discards.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Không có discards.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={discards}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={38}
                      outerRadius={60}
                      paddingAngle={2}
                    >
                      {discards.map((_, i) => (
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
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

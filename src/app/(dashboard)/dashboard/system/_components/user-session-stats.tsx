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
import { CHART_COLORS } from "@/lib/dashboard-chart-colors";
import { formatNumber } from "../../inventory/_components/inventory-format-utils";
import { useOpsUserStats } from "../_hooks/use-ops-user-stats";

const ROLE_LABEL: Record<string, string> = {
  admin: "Quản trị",
  staff: "Nhân viên",
  customer: "Khách hàng",
};

interface StatCardProps {
  label: string;
  value: number | undefined;
  tone?: "default" | "warning" | "danger";
}

function StatCard({ label, value, tone = "default" }: StatCardProps) {
  const toneClass =
    tone === "warning"
      ? "text-amber-600"
      : tone === "danger"
        ? "text-red-600"
        : "text-foreground";
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-semibold ${toneClass}`}>
        {formatNumber(value)}
      </p>
    </div>
  );
}

export function UserSessionStats() {
  const { data, isLoading, error } = useOpsUserStats();

  const roleData = useMemo(() => {
    return Object.entries(data?.role_distribution ?? {}).map(([key, value]) => ({
      key,
      name: ROLE_LABEL[key] ?? key,
      value,
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Người dùng & phiên</CardTitle>
        <p className="text-xs text-muted-foreground">
          Nguồn: <code>/ops/user_stats</code> · làm mới mỗi 5 phút
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <StatCard label="Tổng người dùng" value={data.total_users} />
              <StatCard
                label="Hoạt động 24h"
                value={data.active_last_24h}
              />
              <StatCard
                label="Lời mời đang chờ"
                value={data.pending_invitations}
                tone="warning"
              />
              <StatCard
                label="Bị đình chỉ"
                value={data.suspended}
                tone="danger"
              />
            </div>
            {roleData.length > 0 && (
              <div>
                <p className="mb-1 text-center text-xs text-muted-foreground">
                  Phân bố theo vai trò
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={roleData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {roleData.map((_, i) => (
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
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

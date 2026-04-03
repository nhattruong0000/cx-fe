"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardIconMap } from "@/lib/dashboard-icon-map";
import { CHART_COLORS } from "@/lib/dashboard-chart-colors";
import { statusVariant, formatDate } from "@/lib/dashboard-table-utils";
import { cn } from "@/lib/utils";
import type { StaffDashboardSummary, SurveyRow } from "@/types/dashboard";

const TABS: { label: string; key: TabKey }[] = [
  { label: "Khảo sát", key: "surveys" },
  { label: "Phiếu", key: "tickets" },
  { label: "Báo cáo", key: "reports" },
];
type TabKey = "surveys" | "tickets" | "reports";

interface StaffDashboardProps {
  data: StaffDashboardSummary;
}

export function StaffDashboard({ data }: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("surveys");

  const rowsByTab: Record<TabKey, SurveyRow[]> = {
    surveys: data.surveys,
    tickets: data.tickets,
    reports: [], // placeholder — API may add later
  };
  const currentRows = rowsByTab[activeTab];

  return (
    <div className="min-h-full">
      <h1 className="mb-6 text-2xl font-semibold text-[#09090B]">Bảng điều khiển</h1>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            icon={dashboardIconMap[stat.icon] ?? dashboardIconMap.users}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <ChartCard title="Xu hướng phản hồi">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.response_trends_chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.15} strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Phiếu theo trạng thái">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.tickets_by_status_chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabbed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Khảo sát hoạt động & Phiếu gần đây</CardTitle>
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={cn(
                  "rounded-md px-3 py-1 text-sm transition-colors",
                  activeTab === tab.key
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {currentRows.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Không có dữ liệu</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Tên</th>
                  <th className="pb-2 font-medium">Trạng thái</th>
                  <th className="pb-2 font-medium">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-3">{row.name}</td>
                    <td className="py-3">
                      <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

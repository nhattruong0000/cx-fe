"use client";

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { dashboardIconMap } from "@/lib/dashboard-icon-map";
import { CHART_COLORS } from "@/lib/dashboard-chart-colors";
import type { AdminDashboardSummary } from "@/types/dashboard";

interface AdminDashboardProps {
  data: AdminDashboardSummary;
}

export function AdminDashboard({ data }: AdminDashboardProps) {
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
        <ChartCard title="Phản hồi khảo sát (30 ngày)">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data.survey_responses_chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Phiếu theo danh mục">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.tickets_by_category_chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-[240px_1fr] gap-4">
        <ChartCard title="Vai trò người dùng">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.role_distribution}
                dataKey="count"
                nameKey="role"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.role_distribution.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ActivityFeed items={data.recent_activity} />
      </div>
    </div>
  );
}

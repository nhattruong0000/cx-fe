"use client";

import { useState } from "react";
import { subDays, format } from "date-fns";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiStatCard } from "@/components/analytics/kpi-stat-card";
import { useAnalyticsOverview } from "@/hooks/use-analytics";

const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AnalyticsPage() {
  const [from, setFrom] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const { data, isLoading } = useAnalyticsOverview(from, to);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Phân tích</h1>
          <p className="text-sm text-muted-foreground">
            Tổng quan hiệu suất trải nghiệm khách hàng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Tu</Label>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-[150px]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Den</Label>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-[150px]"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiStatCard
              title="NPS Score"
              value={String(data.kpis.nps_score)}
              trend={data.kpis.nps_trend}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <KpiStatCard
              title="CSAT"
              value={data.kpis.csat_average.toFixed(1)}
              trend={data.kpis.csat_trend}
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <KpiStatCard
              title="Tỉ lệ phản hồi"
              value={`${(data.kpis.response_rate * 100).toFixed(0)}%`}
              trend={data.kpis.response_rate_trend * 100}
              icon={<Users className="h-4 w-4" />}
            />
            <KpiStatCard
              title="TG xử lý TB"
              value={`${data.kpis.avg_resolution_days.toFixed(1)} ngày`}
              trend={data.kpis.resolution_trend}
              icon={<Clock className="h-4 w-4" />}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* NPS Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Xu hướng NPS</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.charts.nps_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* CSAT by Org */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CSAT theo tổ chức</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.charts.csat_by_org} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={12} />
                    <YAxis dataKey="org_name" type="category" fontSize={12} width={100} />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#10B981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Support Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trạng thái hỗ trợ</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.charts.support_status}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {data.charts.support_status.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Response Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tỉ lệ phản hồi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={data.charts.response_rate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#F59E0B" fill="#FEF3C7" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}

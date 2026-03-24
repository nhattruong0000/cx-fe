"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { TierDistribution } from "@/types/analytics";
import { ChartCard } from "./chart-card";
import { formatNumber } from "@/lib/utils";

interface TierDistributionChartProps {
  data: TierDistribution[];
  isLoading?: boolean;
}

const TIER_COLORS: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#94A3B8",
  gold: "#EAB308",
};

const TIER_LABELS: Record<string, string> = {
  bronze: "Đồng",
  silver: "Bạc",
  gold: "Vàng",
};

export function TierDistributionChart({ data, isLoading }: TierDistributionChartProps) {
  const chartData = data.map((d) => ({
    name: TIER_LABELS[d.tier] ?? d.tier,
    value: d.count,
    percentage: d.percentage,
    color: TIER_COLORS[d.tier] ?? "#94A3B8",
  }));

  return (
    <ChartCard title="Phân bố hạng thành viên" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label={({ name, percentage }) => `${name} ${percentage}%`}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatNumber(value)}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "12px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

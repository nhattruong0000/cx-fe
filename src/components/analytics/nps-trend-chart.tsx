"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartDataPoint } from "@/types/analytics";
import { ChartCard } from "./chart-card";

interface NpsTrendChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

export function NpsTrendChart({ data, isLoading }: NpsTrendChartProps) {
  return (
    <ChartCard title="Xu hướng NPS" description="Điểm NPS theo thời gian" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary-500, #3B82F6)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--primary-500, #3B82F6)" }}
            name="NPS"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

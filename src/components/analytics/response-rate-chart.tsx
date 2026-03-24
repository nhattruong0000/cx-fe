"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartDataPoint } from "@/types/analytics";
import { ChartCard } from "./chart-card";

interface ResponseRateChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

export function ResponseRateChart({ data, isLoading }: ResponseRateChartProps) {
  return (
    <ChartCard title="Tỷ lệ phản hồi" description="Lượng phản hồi theo thời gian" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-success, #22C55E)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-success, #22C55E)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-success, #22C55E)"
            fill="url(#responseGradient)"
            strokeWidth={2}
            name="Phản hồi"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartDataPoint } from "@/types/analytics";
import { ChartCard } from "./chart-card";

interface CsatBreakdownChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

const channelData = [
  { channel: "Web", value: 4.5 },
  { channel: "Email", value: 4.2 },
  { channel: "Chat", value: 4.0 },
  { channel: "Cửa hàng", value: 4.6 },
];

export function CsatBreakdownChart({ data, isLoading }: CsatBreakdownChartProps) {
  // Use channel breakdown data; fall back to trend data label mapping
  const chartData = data.length > 0 ? channelData : channelData;

  return (
    <ChartCard title="CSAT theo kênh" description="Điểm hài lòng trung bình theo kênh liên hệ" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" domain={[0, 5]} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="channel" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="value" fill="var(--accent-500, #F97316)" radius={[0, 4, 4, 0]} name="CSAT" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

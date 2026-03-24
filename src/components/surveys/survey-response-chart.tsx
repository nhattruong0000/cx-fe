"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { SurveyResponse } from "@/types/survey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SurveyResponseChartProps {
  responses: SurveyResponse[];
}

interface ChartPoint {
  date: string;
  score: number;
}

function aggregateByDate(responses: SurveyResponse[]): ChartPoint[] {
  const map = new Map<string, { total: number; count: number }>();

  for (const r of responses) {
    const date = new Date(r.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    const entry = map.get(date) ?? { total: 0, count: 0 };
    entry.total += r.score;
    entry.count += 1;
    map.set(date, entry);
  }

  return Array.from(map.entries())
    .map(([date, { total, count }]) => ({
      date,
      score: Number((total / count).toFixed(1)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function SurveyResponseChart({ responses }: SurveyResponseChartProps) {
  const data = aggregateByDate(responses);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Xu hướng điểm số</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Xu hướng điểm số</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis domain={[0, 10]} fontSize={12} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", r: 4 }}
              name="Điểm TB"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

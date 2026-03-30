"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiStatCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
}

export function KpiStatCard({ title, value, trend, icon }: KpiStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && trend !== 0 && (
          <p className={`mt-1 flex items-center text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
            {trend > 0 ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {trend > 0 ? "+" : ""}
            {trend.toFixed(1)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

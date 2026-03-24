"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiStatCardProps {
  label: string;
  value: string | number;
  change?: number;
  suffix?: string;
}

export function KpiStatCard({ label, value, change, suffix }: KpiStatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {change !== undefined && (
          <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", isPositive ? "text-green-600" : "text-red-600")}>
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

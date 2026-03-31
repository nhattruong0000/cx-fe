"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, change, changeLabel, icon: Icon }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-2 text-[28px] font-bold leading-none">{value}</p>
      <div className="mt-2 flex items-center gap-1 text-sm">
        {isPositive ? (
          <ArrowUp className="h-4 w-4 text-green-600" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-600" />
        )}
        <span className={cn(isPositive ? "text-green-600" : "text-red-600")}>
          {Math.abs(change)}%
        </span>
        <span className="text-muted-foreground">{changeLabel}</span>
      </div>
    </Card>
  );
}

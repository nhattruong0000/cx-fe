"use client"

import * as React from "react"
import { TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

type TrendDirection = "up" | "down" | "neutral"

interface StatCardProps extends React.ComponentProps<"div"> {
  label: string
  value: string | number
  trend?: TrendDirection
  trendValue?: string
  icon?: React.ReactNode
}

function StatCard({
  className,
  label,
  value,
  trend = "neutral",
  trendValue,
  icon,
  ...props
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "rounded-lg border bg-card p-4 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {trendValue && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend === "up" && "text-success",
              trend === "down" && "text-error"
            )}
          >
            {trend === "up" && <TrendingUp className="size-3" />}
            {trend === "down" && <TrendingDown className="size-3" />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps, TrendDirection }

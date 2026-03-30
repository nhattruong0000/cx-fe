"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const strengthLabels = ["weak", "fair", "good", "strong"] as const
type StrengthLevel = 0 | 1 | 2 | 3 | 4

interface ProgressProps extends React.ComponentProps<"div"> {
  /** Number of filled segments (0-4) */
  value?: StrengthLevel
  /** Show strength label below the bar */
  showLabel?: boolean
}

function Progress({
  className,
  value = 0,
  showLabel = false,
  ...props
}: ProgressProps) {
  const label = value > 0 ? strengthLabels[value - 1] : undefined

  return (
    <div data-slot="progress" className={cn("flex flex-col gap-1.5", className)} {...props}>
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < value ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>
      {showLabel && label && (
        <span className="text-xs capitalize text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  )
}

export { Progress }
export type { StrengthLevel }

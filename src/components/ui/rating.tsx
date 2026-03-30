"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface RatingProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  value?: number
  max?: number
  size?: "sm" | "default"
  readOnly?: boolean
  onChange?: (value: number) => void
}

function Rating({
  className,
  value = 0,
  max = 5,
  size = "default",
  readOnly = false,
  onChange,
  ...props
}: RatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)

  const displayValue = hovered ?? value

  return (
    <div
      data-slot="rating"
      className={cn("inline-flex gap-0.5", className)}
      onMouseLeave={() => !readOnly && setHovered(null)}
      role="radiogroup"
      aria-label="Rating"
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = starValue <= displayValue
        return (
          <button
            key={starValue}
            type="button"
            disabled={readOnly}
            className={cn(
              "transition-colors focus:outline-none",
              readOnly ? "cursor-default" : "cursor-pointer",
              filled ? "text-warning" : "text-muted-foreground/30"
            )}
            onMouseEnter={() => !readOnly && setHovered(starValue)}
            onClick={() => onChange?.(starValue)}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            role="radio"
            aria-checked={starValue === value}
          >
            <Star
              className={cn(
                size === "sm" ? "size-3.5" : "size-5",
                filled && "fill-current"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export { Rating }
export type { RatingProps }

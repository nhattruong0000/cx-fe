"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground",
        primary:
          "bg-primary-light text-primary",
        destructive:
          "bg-destructive-light text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface TagProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void
}

function Tag({ className, variant, children, onRemove, ...props }: TagProps) {
  return (
    <span
      data-slot="tag"
      className={cn(tagVariants({ variant }), className)}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 opacity-70 hover:opacity-100 focus:outline-none"
          aria-label="Remove"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  )
}

export { Tag, tagVariants }

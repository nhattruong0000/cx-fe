"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative flex w-full gap-3 rounded-lg border p-4 text-sm [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border-border",
        info: "border-info/30 bg-info/5 text-info [&>svg]:text-info",
        success:
          "border-success/30 bg-success/5 text-success [&>svg]:text-success",
        warning:
          "border-warning/30 bg-warning/5 text-warning [&>svg]:text-warning",
        error:
          "border-error/30 bg-error/5 text-error [&>svg]:text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantIcons = {
  default: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
} as const

function Alert({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const Icon = variantIcons[variant ?? "default"]
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon />
      <div className="flex-1">{children}</div>
    </div>
  )
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm opacity-80 [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }

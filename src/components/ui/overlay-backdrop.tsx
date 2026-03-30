"use client"

import { cn } from "@/lib/utils"

interface OverlayBackdropProps extends React.ComponentProps<"div"> {
  visible: boolean
  onClose?: () => void
}

export function OverlayBackdrop({
  visible,
  onClose,
  className,
  ...props
}: OverlayBackdropProps) {
  if (!visible) return null

  return (
    <div
      data-slot="overlay-backdrop"
      className={cn(
        "fixed inset-0 z-40 bg-black/10 transition-opacity duration-150 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      onClick={onClose}
      aria-hidden="true"
      {...props}
    />
  )
}

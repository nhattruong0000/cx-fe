"use client"

import type { LucideIcon } from "lucide-react"

interface InventoryEmptyStateProps {
  /** Lucide icon component to display */
  icon: LucideIcon
  title: string
  description?: string
  /** Optional CTA button */
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Reusable empty-state block for inventory list tables.
 * Renders icon + title + optional description + optional CTA button.
 */
export function InventoryEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: InventoryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[10px] border border-border bg-card py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex h-9 items-center rounded-[10px] border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

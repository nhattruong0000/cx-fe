import { cn } from "@/lib/utils"

interface NotificationBadgeProps {
  count?: number
  showDot?: boolean
  className?: string
  children: React.ReactNode
}

export function NotificationBadge({
  count,
  showDot,
  className,
  children,
}: NotificationBadgeProps) {
  const hasNotification = showDot || (count !== undefined && count > 0)

  return (
    <span className={cn("relative inline-flex", className)}>
      {children}
      {hasNotification && (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-destructive text-destructive-foreground",
            count
              ? "-right-1.5 -top-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-medium"
              : "-right-0.5 -top-0.5 size-2"
          )}
        >
          {count ? (count > 99 ? "99+" : count) : null}
        </span>
      )}
    </span>
  )
}

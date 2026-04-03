"use client"

import { formatRelativeTime } from "@/lib/format-relative-time"
import { NOTIFICATION_ICON_MAP, NOTIFICATION_STYLE_MAP } from "@/lib/notification-icon-map"
import type { Notification } from "@/types/notification"

interface NotificationListItemProps {
  notification: Notification
  onMarkRead?: (id: string) => void
  variant?: "page" | "popup"
}

/** Unified notification item — supports page (28px icon) and popup (36px icon) variants */
export function NotificationListItem({
  notification,
  onMarkRead,
  variant = "page",
}: NotificationListItemProps) {
  const Icon = NOTIFICATION_ICON_MAP[notification.type]
  const style = NOTIFICATION_STYLE_MAP[notification.type]
  const isPopup = variant === "popup"

  return (
    <button
      type="button"
      onClick={() =>
        !notification.isRead && onMarkRead?.(notification.id)
      }
      className={`flex w-full items-start text-left transition-colors hover:bg-[#F8FAFC] ${
        isPopup ? "gap-3 px-4 py-3" : "gap-2.5 px-3.5 py-2"
      } ${notification.isRead ? "" : "bg-[#F0F7FF]"}`}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${
          isPopup ? "h-9 w-9" : "h-7 w-7"
        } ${style.bg}`}
      >
        <Icon className={`${isPopup ? "h-[18px] w-[18px]" : "h-3.5 w-3.5"} ${style.icon}`} />
      </div>

      <div className={`min-w-0 flex-1 ${isPopup ? "space-y-1" : "space-y-0.5"}`}>
        <p className="text-[13px] font-semibold text-[#09090B]">
          {notification.title}
        </p>
        <p className={`leading-snug text-[#71717A] ${isPopup ? "text-xs" : "text-[11px]"}`}>
          {notification.description}
        </p>
        <p className={`text-[11px] ${isPopup ? "text-[#94A3B8]" : "text-[#71717A]"}`}>
          {formatRelativeTime(notification.timestamp)}
        </p>
      </div>

      {!notification.isRead && (
        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2556C5]" />
      )}
    </button>
  )
}

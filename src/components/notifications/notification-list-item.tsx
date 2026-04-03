"use client"

import { formatRelativeTime } from "@/lib/format-relative-time"
import { NOTIFICATION_ICON_MAP, NOTIFICATION_STYLE_MAP } from "@/lib/notification-icon-map"
import type { Notification } from "@/types/notification"

interface NotificationListItemProps {
  notification: Notification
  onMarkRead?: (id: string) => void
}

/** Page-variant notification item — 28px icon, 11px desc (matching design 3jhDF) */
export function NotificationListItem({
  notification,
  onMarkRead,
}: NotificationListItemProps) {
  const Icon = NOTIFICATION_ICON_MAP[notification.type]
  const style = NOTIFICATION_STYLE_MAP[notification.type]

  return (
    <button
      type="button"
      onClick={() =>
        !notification.isRead && onMarkRead?.(notification.id)
      }
      className={`flex w-full items-start gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-[#F8FAFC] ${
        notification.isRead ? "" : "bg-[#F0F7FF]"
      }`}
    >
      {/* Icon circle — 28px matching design */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.bg}`}
      >
        <Icon className={`h-3.5 w-3.5 ${style.icon}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-[13px] font-semibold text-[#09090B]">
          {notification.title}
        </p>
        <p className="text-[11px] leading-snug text-[#71717A]">
          {notification.description}
        </p>
        <p className="text-[11px] text-[#71717A]">
          {formatRelativeTime(notification.timestamp)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2556C5]" />
      )}
    </button>
  )
}

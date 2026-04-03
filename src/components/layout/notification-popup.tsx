"use client"

import { useRouter } from "next/navigation"
import { useNotifications, useMarkAsRead } from "@/hooks/use-notifications"
import { formatRelativeTime } from "@/lib/format-relative-time"
import { NOTIFICATION_ICON_MAP, NOTIFICATION_STYLE_MAP } from "@/lib/notification-icon-map"
import type { Notification } from "@/types/notification"

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const Icon = NOTIFICATION_ICON_MAP[notification.type]
  const style = NOTIFICATION_STYLE_MAP[notification.type]

  return (
    <button
      type="button"
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F8FAFC] ${
        notification.isRead ? "" : "bg-[#F0F7FF]"
      }`}
    >
      {/* Icon circle */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg}`}
      >
        <Icon className={`h-[18px] w-[18px] ${style.icon}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[13px] font-semibold text-[#09090B]">
          {notification.title}
        </p>
        <p className="text-xs leading-snug text-[#71717A]">
          {notification.description}
        </p>
        <p className="text-[11px] text-[#94A3B8]">
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

interface NotificationPopupProps {
  onClose: () => void
}

/** Notification popup content — renders inside Popover */
export function NotificationPopup({ onClose }: NotificationPopupProps) {
  const router = useRouter()
  const { data, isLoading } = useNotifications("all", 1)
  const markAsRead = useMarkAsRead()

  const notifications = data?.notifications.slice(0, 3) ?? []
  const unreadCount = data?.unreadCount ?? 0

  function handleViewAll() {
    onClose()
    router.push("/notifications")
  }

  return (
    <div className="w-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="text-base font-semibold text-[#09090B]">
          Thông báo
        </span>
        {unreadCount > 0 && (
          <span className="flex items-center justify-center rounded-full bg-[#E81B22] px-2 py-0.5 text-[11px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-[#E4E4E7]" />

      {/* Notification list */}
      <div>
        {isLoading ? (
          <div className="flex h-24 items-center justify-center text-sm text-[#71717A]">
            Đang tải...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-[#71717A]">
            Không có thông báo mới.
          </div>
        ) : (
          notifications.map((n, i) => (
            <div key={n.id}>
              <NotificationItem
                notification={n}
                onMarkRead={(id) => markAsRead.mutate(id)}
              />
              {i < notifications.length - 1 && (
                <div className="h-px w-full bg-[#E4E4E7]" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-[#E4E4E7]" />

      {/* Footer */}
      <button
        type="button"
        onClick={handleViewAll}
        className="flex w-full items-center justify-center px-4 py-3 text-[13px] font-medium text-[#2556C5] transition-colors hover:bg-[#F8FAFC]"
      >
        Xem tất cả thông báo
      </button>
    </div>
  )
}

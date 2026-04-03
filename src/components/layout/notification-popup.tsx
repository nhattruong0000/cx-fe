"use client"

import { useRouter } from "next/navigation"
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/hooks/use-notifications"
import { NotificationListItem } from "@/components/notifications/notification-list-item"

interface NotificationPopupProps {
  onClose: () => void
}

/** Notification popup content — renders inside Popover */
export function NotificationPopup({ onClose }: NotificationPopupProps) {
  const router = useRouter()
  const { data, isLoading } = useNotifications("all", 1, 3)
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const notifications = data?.notifications ?? []
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
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="text-[12px] font-medium text-[#2556C5] transition-colors hover:text-[#1D4499] disabled:opacity-50"
            >
              Đọc tất cả
            </button>
          )}
          {unreadCount > 0 && (
            <span className="flex items-center justify-center rounded-full bg-[#E81B22] px-2 py-0.5 text-[11px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </div>
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
              <NotificationListItem
                variant="popup"
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

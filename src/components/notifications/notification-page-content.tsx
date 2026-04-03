"use client"

import { useState } from "react"
import { CheckCheck } from "lucide-react"
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/hooks/use-notifications"
import { NotificationListItem } from "@/components/notifications/notification-list-item"
import { Pagination } from "@/components/ui/pagination"
import type { NotificationFilter } from "@/types/notification"

const TABS: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "unread", label: "Chưa đọc" },
  { value: "read", label: "Đã đọc" },
]

export function NotificationPageContent() {
  const [activeTab, setActiveTab] = useState<NotificationFilter>("all")
  const [page, setPage] = useState(1)
  const { data, isLoading } = useNotifications(activeTab, page)
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0
  const total = data?.total ?? 0
  const pageSize = data?.pageSize ?? 12

  function handleTabChange(tab: NotificationFilter) {
    setActiveTab(tab)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#09090B]">
          Thông báo
        </h1>
        <p className="text-sm text-[#71717A]">
          Quản lý tùy chọn thông báo và xem các cảnh báo gần đây.
        </p>
      </div>

      {/* Action bar: tabs + mark all read */}
      <div className="flex items-center justify-between">
        {/* Pill-style tabs */}
        <div className="flex items-center gap-1 border-b border-[#E4E4E7]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value
            const badgeCount =
              tab.value === "all"
                ? total
                : tab.value === "unread"
                  ? unreadCount
                  : total - unreadCount

            return (
              <button
                type="button"
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-[#EBF0FA] font-medium text-[#2556C5]"
                    : "text-[#71717A] hover:text-[#09090B]"
                }`}
              >
                {tab.label}
                {badgeCount > 0 && (
                  <span
                    className={`flex items-center justify-center rounded-full px-1.5 py-px text-[11px] font-semibold text-white ${
                      tab.value === "unread"
                        ? "bg-[#E81B22]"
                        : "bg-[#2556C5]"
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Mark all as read */}
        <button
          type="button"
          onClick={() => markAllAsRead.mutate()}
          disabled={unreadCount === 0}
          className="flex items-center gap-1.5 rounded-[10px] border border-[#E4E4E7] px-3 py-2 text-[13px] font-medium text-[#09090B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-40"
        >
          <CheckCheck className="h-4 w-4 text-[#71717A]" />
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* Notification card */}
      <div className="overflow-hidden rounded-[14px] border border-[#E4E4E7] bg-white">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-[#71717A]">
            Đang tải...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-[#71717A]">
            Không có thông báo nào.
          </div>
        ) : (
          <>
            {notifications.map((n, i) => (
              <div key={n.id}>
                <NotificationListItem
                  notification={n}
                  onMarkRead={(id) => markAsRead.mutate(id)}
                />
                {i < notifications.length - 1 && (
                  <div className="h-px w-full bg-[#E4E4E7]" />
                )}
              </div>
            ))}

            {/* Footer count */}
            <div className="h-px w-full bg-[#E4E4E7]" />
            <div className="flex items-center justify-center px-4 py-3">
              <span className="text-[13px] text-[#71717A]">
                Hiển thị {notifications.length} / {total} thông báo
              </span>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          itemLabel="thông báo"
        />
      )}
    </div>
  )
}

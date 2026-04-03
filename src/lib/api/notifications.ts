import type {
  NotificationFilter,
  NotificationsResponse,
} from "@/types/notification"
import { apiClient } from "./client"

/** Fetch paginated notifications with optional filter */
export async function getNotifications(
  filter: NotificationFilter = "all",
  page = 1,
  pageSize = 12
): Promise<NotificationsResponse> {
  const params = new URLSearchParams({
    filter,
    page: page.toString(),
    per_page: pageSize.toString(),
  })
  const data = await apiClient.get<{
    notifications: NotificationsResponse["notifications"]
    unread_count: number
    pagination: { total_count: number; current_page: number }
  }>(`/api/v1/notifications?${params}`)

  return {
    notifications: data.notifications,
    unreadCount: data.unread_count,
    total: data.pagination.total_count,
    page: data.pagination.current_page,
    pageSize,
  }
}

/** Mark a single notification as read */
export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.patch(`/api/v1/notifications/${id}/read`)
}

/** Mark all notifications as read */
export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch("/api/v1/notifications/read_all")
}

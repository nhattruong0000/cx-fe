import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api/notifications"
import { getCableConsumer } from "@/lib/action-cable-client"
import type { NotificationFilter } from "@/types/notification"

const NOTIFICATIONS_KEY = "notifications"

/** Fetch notifications with filter and pagination */
export function useNotifications(
  filter: NotificationFilter = "all",
  page = 1
) {
  return useQuery({
    queryKey: [NOTIFICATIONS_KEY, filter, page],
    queryFn: () => getNotifications(filter, page),
    staleTime: 60 * 1000,
  })
}

/** Subscribe to real-time notifications via ActionCable.
 *  Invalidates notification queries when new notification arrives. */
export function useNotificationSubscription() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const consumer = getCableConsumer()
    if (!consumer) return

    const subscription = consumer.subscriptions.create(
      "NotificationsChannel",
      {
        received(data: { type: string }) {
          if (data.type === "new_notification") {
            queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] })
          }
        },
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])
}

/** Mark a single notification as read */
export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] })
    },
    onError: () => {
      toast.error("Không thể đánh dấu đã đọc")
    },
  })
}

/** Mark all notifications as read */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] })
    },
    onError: () => {
      toast.error("Không thể đánh dấu tất cả đã đọc")
    },
  })
}

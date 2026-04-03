import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api/notifications"
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
    refetchInterval: 5 * 60 * 1000,
  })
}

/** Mark a single notification as read */
export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] })
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
  })
}

export type NotificationType =
  | "survey_response"
  | "low_satisfaction"
  | "new_user"
  | "system"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  /** ISO 8601 timestamp */
  timestamp: string
  isRead: boolean
}

export interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
  total: number
  page: number
  pageSize: number
}

export type NotificationFilter = "all" | "unread" | "read"

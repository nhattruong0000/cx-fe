import type {
  Notification,
  NotificationFilter,
  NotificationsResponse,
} from "@/types/notification"

/** Mock notification data matching design specs */
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "survey_response",
    title: "Phản hồi khảo sát mới",
    description:
      'Khách hàng "Nguyễn Văn A" đã gửi phản hồi cho Đơn hàng #1234.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: "n2",
    type: "low_satisfaction",
    title: "Cảnh báo mức hài lòng thấp",
    description: "3 khảo sát có đánh giá dưới 3/5 trong 24 giờ qua.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: "n3",
    type: "new_user",
    title: "Người dùng mới đăng ký",
    description: "Trần Thị B đã đăng ký và đang chờ phê duyệt.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: "n4",
    type: "survey_response",
    title: "Nhận được phản hồi khảo sát mới",
    description:
      "Khách hàng đã gửi phản hồi chi tiết cho Khảo sát Hài lòng Q1.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "n5",
    type: "low_satisfaction",
    title: "Phát hiện điểm hài lòng thấp",
    description:
      "Khách hàng đánh giá trải nghiệm 2/10 trong khảo sát tương tác hỗ trợ gần nhất.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "n6",
    type: "new_user",
    title: "Người dùng mới đăng ký",
    description:
      "John Smith đã tạo tài khoản mới và hoàn tất quy trình đăng ký.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "n7",
    type: "system",
    title: "Bảo trì hệ thống đã hoàn tất",
    description: "Hệ thống đã được cập nhật lên phiên bản 2.4.1 thành công.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "n8",
    type: "survey_response",
    title: "Phản hồi khảo sát hàng loạt",
    description: "5 phản hồi mới cho khảo sát NPS tháng 3.",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "n9",
    type: "low_satisfaction",
    title: "Xu hướng hài lòng giảm",
    description:
      "Điểm hài lòng trung bình giảm 15% so với tuần trước.",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "n10",
    type: "new_user",
    title: "Nhóm người dùng mới",
    description: "3 người dùng mới từ tổ chức ABC Corp đã đăng ký.",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "n11",
    type: "system",
    title: "Sao lưu dữ liệu thành công",
    description: "Bản sao lưu tự động đã hoàn tất lúc 03:00 AM.",
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "n12",
    type: "survey_response",
    title: "Phản hồi khảo sát đặc biệt",
    description: 'Khách hàng VIP "Lê Văn C" đã để lại đánh giá 5 sao.',
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
]

/** Simulates API delay */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** In-memory state for mock mutations */
let notifications = [...MOCK_NOTIFICATIONS]

function filterNotifications(
  filter: NotificationFilter
): Notification[] {
  if (filter === "unread") return notifications.filter((n) => !n.isRead)
  if (filter === "read") return notifications.filter((n) => n.isRead)
  return notifications
}

export async function getNotifications(
  filter: NotificationFilter = "all",
  page = 1,
  pageSize = 12
): Promise<NotificationsResponse> {
  await delay()
  const filtered = filterNotifications(filter)
  const start = (page - 1) * pageSize
  const paginated = filtered.slice(start, start + pageSize)
  return {
    notifications: paginated,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    total: filtered.length,
    page,
    pageSize,
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await delay(150)
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  )
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await delay(200)
  notifications = notifications.map((n) => ({ ...n, isRead: true }))
}

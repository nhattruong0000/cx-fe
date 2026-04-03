import {
  MessageSquare,
  TriangleAlert,
  UserPlus,
  Bell,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { NotificationType } from "@/types/notification"

/** Lucide icon component per notification type */
export const NOTIFICATION_ICON_MAP: Record<NotificationType, LucideIcon> = {
  survey_response: MessageSquare,
  low_satisfaction: TriangleAlert,
  new_user: UserPlus,
  system: Bell,
}

/** Background + icon color classes per notification type (matches design system) */
export const NOTIFICATION_STYLE_MAP: Record<
  NotificationType,
  { bg: string; icon: string }
> = {
  survey_response: { bg: "bg-[#EBF0FA]", icon: "text-[#2556C5]" },
  low_satisfaction: { bg: "bg-[#FEF2F2]", icon: "text-[#E81B22]" },
  new_user: { bg: "bg-[#F0FDF4]", icon: "text-[#16A34A]" },
  system: { bg: "bg-[#F4F4F5]", icon: "text-[#71717A]" },
}

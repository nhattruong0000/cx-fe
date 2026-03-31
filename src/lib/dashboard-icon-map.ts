import {
  Users,
  ClipboardList,
  Ticket,
  Percent,
  BarChart3,
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Maps icon name strings from API response to lucide-react components */
export const dashboardIconMap: Record<string, LucideIcon> = {
  users: Users,
  "clipboard-list": ClipboardList,
  clipboard: ClipboardList,
  ticket: Ticket,
  percent: Percent,
  "bar-chart": BarChart3,
  "file-text": FileText,
  message: MessageSquare,
  check: CheckCircle2,
  clock: Clock,
  trending: TrendingUp,
};

"use client";

import { formatDate } from "@/lib/utils";
import type { Activity } from "@/types/support";

const actionLabels: Record<string, string> = {
  created: "Tạo yêu cầu",
  assigned: "Phân công KTV",
  started: "Bắt đầu thực hiện",
  completed: "Hoàn thành",
  cancelled: "Hủy",
  rescheduled: "Đổi lịch",
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">Chưa có hoạt động</p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            {idx < activities.length - 1 && (
              <div className="w-px flex-1 bg-border" />
            )}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium">
              {actionLabels[activity.action] || activity.action}
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.user_name} &middot; {formatDate(activity.created_at)}
            </p>
            {activity.note && (
              <p className="mt-1 text-sm text-muted-foreground">
                {activity.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

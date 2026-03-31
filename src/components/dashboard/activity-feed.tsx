"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { ActivityItem } from "@/types/dashboard";

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No recent activity</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
              {item.user_initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">
                <span className="font-medium">{item.user_name}</span>{" "}
                {item.action}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(item.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

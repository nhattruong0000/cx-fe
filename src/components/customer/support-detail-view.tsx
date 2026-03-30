"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/schedules/status-badge";
import { ActivityTimeline } from "@/components/schedules/activity-timeline";
import { useCustomerSupportDetail } from "@/hooks/use-support-requests";
import { formatDate } from "@/lib/utils";

interface SupportDetailViewProps {
  requestId: number;
}

export function SupportDetailView({ requestId }: SupportDetailViewProps) {
  const { data: request, isLoading } = useCustomerSupportDetail(requestId);

  if (isLoading || !request) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{request.issue_summary}</CardTitle>
            <StatusBadge status={request.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div><span className="text-muted-foreground">Ngày tạo:</span> {formatDate(request.created_at)}</div>
          <div><span className="text-muted-foreground">Liên hệ:</span> {request.contact_name} - {request.phone}</div>
          {request.scheduled_date && (
            <div><span className="text-muted-foreground">Ngày hẹn:</span> {formatDate(request.scheduled_date)} {request.scheduled_time || ""}</div>
          )}
          {request.technician_name && (
            <div><span className="text-muted-foreground">KTV:</span> {request.technician_name}</div>
          )}
          <div className="sm:col-span-2"><span className="text-muted-foreground">Mô tả:</span> {request.description}</div>
        </CardContent>
      </Card>

      {request.status === "completed" && request.result_note && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ket qua xu ly</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{request.result_note}</p>
            {request.completed_at && (
              <p className="mt-2 text-xs text-muted-foreground">
                Hoàn thành lúc {formatDate(request.completed_at)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tiến trình</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline activities={request.activity_log} />
        </CardContent>
      </Card>
    </div>
  );
}

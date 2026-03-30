"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/schedules/status-badge";
import { formatDate } from "@/lib/utils";
import type { SupportRequest } from "@/types/support";

export function SupportRequestCard({ request }: { request: SupportRequest }) {
  return (
    <Link href={`/customer/support/${request.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex-row items-start justify-between">
          <CardTitle className="text-base">{request.issue_summary}</CardTitle>
          <StatusBadge status={request.status} />
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>Ngày tạo: {formatDate(request.created_at)}</p>
          {request.scheduled_date && (
            <p>Ngày hẹn: {formatDate(request.scheduled_date)}</p>
          )}
          {request.technician_name && (
            <p>KTV: {request.technician_name}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

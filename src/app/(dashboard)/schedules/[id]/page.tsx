"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleDetailView } from "@/components/schedules/schedule-detail-view";

export default function ScheduleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/schedules" />}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Lịch hỗ trợ
      </Button>
      <ScheduleDetailView requestId={Number(id)} />
    </div>
  );
}

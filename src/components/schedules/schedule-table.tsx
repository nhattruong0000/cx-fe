"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./status-badge";
import { useSupportRequests } from "@/hooks/use-support-requests";
import { formatDate } from "@/lib/utils";

interface ScheduleTableProps {
  page: number;
  status?: string;
  search?: string;
}

export function ScheduleTable({ page, status, search }: ScheduleTableProps) {
  const { data, isLoading } = useSupportRequests({ page, status, q: search });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const requests = data?.data || [];

  if (requests.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        {search ? "Không tìm thấy yêu cầu phù hợp" : "Chưa có yêu cầu hỗ trợ nào"}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vấn đề</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Tổ chức</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày hẹn</TableHead>
          <TableHead>KTV</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req.id}>
            <TableCell>
              <Link
                href={`/schedules/${req.id}`}
                className="font-medium text-primary hover:underline"
              >
                {req.issue_summary}
              </Link>
            </TableCell>
            <TableCell>{req.customer_name}</TableCell>
            <TableCell className="text-muted-foreground">
              {req.organization_name}
            </TableCell>
            <TableCell>
              <StatusBadge status={req.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {req.scheduled_date ? formatDate(req.scheduled_date) : "-"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {req.technician_name || "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

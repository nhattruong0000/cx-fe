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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyTypeBadge } from "./survey-type-badge";
import { useSurveys } from "@/hooks/use-surveys";
import { formatDate } from "@/lib/utils";

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Nháp", variant: "outline" },
  active: { label: "Hoạt động", variant: "default" },
  closed: { label: "Đóng", variant: "secondary" },
};

interface SurveyTableProps {
  page: number;
  surveyType?: string;
  status?: string;
  search?: string;
}

export function SurveyTable({ page, surveyType, status, search }: SurveyTableProps) {
  const { data, isLoading } = useSurveys({
    page,
    survey_type: surveyType,
    status,
    q: search,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const surveys = data?.data || [];

  if (surveys.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        {search ? "Không tìm thấy khảo sát phù hợp" : "Chưa có khảo sát nào"}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Phản hồi</TableHead>
          <TableHead>Điểm TB</TableHead>
          <TableHead>Ngày tạo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {surveys.map((survey) => {
          const sb = statusBadge[survey.status] || statusBadge.draft;
          return (
            <TableRow key={survey.id}>
              <TableCell>
                <Link
                  href={`/surveys/${survey.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {survey.title}
                </Link>
              </TableCell>
              <TableCell>
                <SurveyTypeBadge type={survey.survey_type} />
              </TableCell>
              <TableCell>
                <Badge variant={sb.variant}>{sb.label}</Badge>
              </TableCell>
              <TableCell>{survey.response_count}</TableCell>
              <TableCell>
                {survey.avg_score != null ? survey.avg_score.toFixed(1) : "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(survey.created_at)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

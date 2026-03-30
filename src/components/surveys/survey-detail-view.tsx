"use client";

import { useState } from "react";
import { BarChart3, ClipboardList, Eye, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SurveyTypeBadge } from "./survey-type-badge";

const statusLabel: Record<string, string> = {
  draft: "Nháp",
  active: "Hoạt động",
  closed: "Đóng",
};

import {
  useSurveyDetail,
  useSurveyStats,
  useSurveyResponses,
} from "@/hooks/use-surveys";
import { formatDate } from "@/lib/utils";
import { SurveyPreviewDialog } from "./survey-preview-dialog";
import { SurveyTrendChart } from "./survey-trend-chart";
import { SurveyDistributionChart } from "./survey-distribution-chart";

interface SurveyDetailViewProps {
  surveyId: number;
}

export function SurveyDetailView({ surveyId }: SurveyDetailViewProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data: survey, isLoading } = useSurveyDetail(surveyId);
  const { data: stats } = useSurveyStats(surveyId);
  const { data: responses } = useSurveyResponses(surveyId);

  if (isLoading || !survey) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{survey.title}</h1>
          <SurveyTypeBadge type={survey.survey_type} />
          <Badge variant={survey.status === "active" ? "default" : "secondary"}>
            {statusLabel[survey.status] || survey.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
            <Eye className="mr-1 h-4 w-4" />
            Xem trước
          </Button>
        </div>
        {survey.description && (
          <p className="mt-1 text-muted-foreground">{survey.description}</p>
        )}
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Phản hồi"
            value={String(stats.response_count)}
            icon={<Users className="h-4 w-4" />}
          />
          <KpiCard
            title="Điểm trung bình"
            value={stats.avg_score != null ? stats.avg_score.toFixed(1) : "-"}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            title="Tỷ lệ phản hồi"
            value={`${stats.response_rate}%`}
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <KpiCard
            title="Câu hỏi"
            value={String(survey.question_count)}
            icon={<ClipboardList className="h-4 w-4" />}
          />
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SurveyTrendChart data={stats.trend} />
          <SurveyDistributionChart data={stats.distribution} />
        </div>
      )}

      {/* Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Phản hồi ({responses?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!responses?.data?.length ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Chưa có phản hồi nào
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tổ chức</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Ngày</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.customer_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.organization_name}
                    </TableCell>
                    <TableCell>
                      {r.score != null ? r.score.toFixed(1) : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(r.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SurveyPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={{
          title: survey.title,
          survey_type: survey.survey_type,
          description: survey.description,
          questions: survey.questions,
        }}
      />
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

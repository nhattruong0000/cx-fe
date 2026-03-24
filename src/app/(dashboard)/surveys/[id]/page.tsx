"use client";

import { use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QueryBoundary } from "@/components/query-boundary";
import { SurveyTypeBadge } from "@/components/surveys/survey-type-badge";
import { SurveyResponseChart } from "@/components/surveys/survey-response-chart";
import { SurveyResponseList } from "@/components/surveys/survey-response-list";
import { useSurvey, useResponses } from "@/hooks/use-surveys";
import { formatNumber, formatDate } from "@/lib/utils";
import { ArrowLeft, MessageSquare, Star, Users } from "lucide-react";

export default function SurveyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const survey = useSurvey(id);
  const responses = useResponses(id);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/surveys" />}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Quay lại
      </Button>

      <QueryBoundary
        isLoading={survey.isLoading}
        isError={survey.isError}
        error={survey.error}
        onRetry={() => survey.refetch()}
        isEmpty={!survey.data}
        emptyMessage="Không tìm thấy khảo sát"
      >
        {survey.data && (
          <>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{survey.data.title}</h1>
              <SurveyTypeBadge type={survey.data.type} />
            </div>

            <p className="text-sm text-muted-foreground">
              {survey.data.description} — Tạo ngày {formatDate(survey.data.createdAt)}
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                title="Điểm trung bình"
                value={survey.data.averageScore.toFixed(1)}
                icon={<Star className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="Phản hồi"
                value={formatNumber(survey.data.responseCount)}
                icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="Câu hỏi"
                value={String(survey.data.questions.length)}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <QueryBoundary
              isLoading={responses.isLoading}
              isError={responses.isError}
              error={responses.error}
              onRetry={() => responses.refetch()}
            >
              {responses.data && (
                <>
                  <SurveyResponseChart responses={responses.data.data} />
                  <SurveyResponseList responses={responses.data.data} />
                </>
              )}
            </QueryBoundary>
          </>
        )}
      </QueryBoundary>
    </div>
  );
}

function StatCard({
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
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

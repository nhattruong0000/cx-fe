"use client";

import type { Survey } from "@/types/survey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SurveyTypeBadge } from "./survey-type-badge";
import { formatNumber } from "@/lib/utils";
import { MessageSquare, Star } from "lucide-react";

interface SurveyCardProps {
  survey: Survey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{survey.title}</CardTitle>
        <SurveyTypeBadge type={survey.type} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {formatNumber(survey.responseCount)} phản hồi
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {survey.averageScore.toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

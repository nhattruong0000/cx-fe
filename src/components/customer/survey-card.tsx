"use client";

import Link from "next/link";
import { CheckCircle, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SurveyTypeBadge } from "@/components/surveys/survey-type-badge";
import type { CustomerSurvey } from "@/types/survey";

export function CustomerSurveyCard({ survey }: { survey: CustomerSurvey }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">{survey.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{survey.description}</p>
        </div>
        <SurveyTypeBadge type={survey.survey_type} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardList className="h-4 w-4" />
            <span>{survey.question_count} câu hỏi</span>
          </div>
          {survey.has_responded ? (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Da phan hoi
            </Badge>
          ) : (
            <Button size="sm" render={<Link href={`/customer/surveys/${survey.id}`} />}>
              Làm khảo sát
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

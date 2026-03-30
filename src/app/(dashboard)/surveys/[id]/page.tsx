"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurveyDetailView } from "@/components/surveys/survey-detail-view";

export default function SurveyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/surveys" />}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Khảo sát
      </Button>
      <SurveyDetailView surveyId={Number(id)} />
    </div>
  );
}

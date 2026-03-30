"use client";

import { use } from "react";
import { SurveyResponseForm } from "@/components/customer/survey-response-form";

export default function CustomerSurveyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <SurveyResponseForm surveyId={Number(id)} />;
}

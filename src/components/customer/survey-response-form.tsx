"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyTypeBadge } from "@/components/surveys/survey-type-badge";
import { QuestionInput } from "@/components/surveys/question-input";
import { useCustomerSurveyDetail, useSubmitResponse } from "@/hooks/use-surveys";

interface SurveyResponseFormProps {
  surveyId: number;
}

export function SurveyResponseForm({ surveyId }: SurveyResponseFormProps) {
  const router = useRouter();
  const { data: survey, isLoading } = useCustomerSurveyDetail(surveyId);
  const submitMut = useSubmitResponse();
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const setAnswer = (questionId: number, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitMut.mutateAsync({ id: surveyId, data: { answers } });
      toast.success("Gửi phản hồi thành công!");
      router.push("/customer/surveys");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gửi phản hồi thất bại");
    }
    setSubmitting(false);
  };

  if (isLoading || !survey) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{survey.title}</h1>
          <SurveyTypeBadge type={survey.survey_type} />
        </div>
        {survey.description && (
          <p className="mt-1 text-muted-foreground">{survey.description}</p>
        )}
      </div>

      {survey.questions.map((q, idx) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {idx + 1}. {q.text}
              {q.required && <span className="ml-1 text-destructive">*</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionInput
              question={q}
              value={answers[String(q.id)]}
              onChange={(val) => setAnswer(q.id, val)}
            />
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Gửi phản hồi"
          )}
        </Button>
      </div>
    </form>
  );
}


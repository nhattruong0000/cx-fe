"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SurveyTypeBadge } from "@/components/surveys/survey-type-badge";
import { QuestionInput } from "@/components/surveys/question-input";
import type { PreviewSurveyData } from "@/components/surveys/survey-preview-dialog";

interface SurveyPreviewPanelProps {
  data: PreviewSurveyData;
}

/** Inline preview panel showing how customers will see the survey */
export function SurveyPreviewPanel({ data }: SurveyPreviewPanelProps) {
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});

  const setAnswer = (questionId: number | string, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }));
  };

  return (
    <div className="sticky top-6 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Eye className="h-4 w-4" />
        Xem trước
      </div>

      {/* Simulated customer view */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">
              {data.title || "Khảo sát chưa có tiêu đề"}
            </h2>
            <SurveyTypeBadge type={data.survey_type} />
          </div>
          {data.description && (
            <p className="mt-1 text-sm text-muted-foreground">{data.description}</p>
          )}
        </div>

        {data.questions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Thêm câu hỏi để xem trước giao diện khách hàng
          </p>
        ) : (
          <div className="space-y-3">
            {data.questions.map((q, idx) => (
              <Card key={q.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {idx + 1}. {q.text || "Câu hỏi chưa có nội dung"}
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
          </div>
        )}

        <Button disabled className="w-full">
          Gửi phản hồi
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SurveyTypeBadge } from "@/components/surveys/survey-type-badge";
import { QuestionInput } from "@/components/surveys/question-input";
import type { PreviewQuestion } from "@/components/surveys/question-input";
import type { SurveyType } from "@/types/survey";

export interface PreviewSurveyData {
  title: string;
  survey_type: SurveyType;
  description?: string;
  questions: PreviewQuestion[];
}

interface SurveyPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PreviewSurveyData;
}

export function SurveyPreviewDialog({
  open,
  onOpenChange,
  data,
}: SurveyPreviewDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});

  const setAnswer = (questionId: number | string, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {data.title || "Khảo sát chưa có tiêu đề"}
            <SurveyTypeBadge type={data.survey_type} />
          </DialogTitle>
        </DialogHeader>

        {/* Preview banner */}
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Bản xem trước — Đây là giao diện khách hàng sẽ thấy</span>
        </div>

        {data.description && (
          <p className="text-sm text-muted-foreground">{data.description}</p>
        )}

        {data.questions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Chưa có câu hỏi nào
          </p>
        ) : (
          <div className="space-y-4">
            {data.questions.map((q, idx) => (
              <Card key={q.id}>
                <CardHeader className="pb-2">
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
          </div>
        )}

        <Button disabled className="w-full">
          Gửi phản hồi
        </Button>
      </DialogContent>
    </Dialog>
  );
}

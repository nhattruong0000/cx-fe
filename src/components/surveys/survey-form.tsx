"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OptionListEditor } from "@/components/surveys/option-list-editor";
import { OrganizationSelector } from "@/components/surveys/organization-selector";
import { SurveyPreviewPanel } from "@/components/surveys/survey-preview-panel";
import { useCreateSurvey } from "@/hooks/use-surveys";
import type { QuestionType, SurveyType } from "@/types/survey";

const surveySchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().optional(),
});

type SurveyFormValues = z.infer<typeof surveySchema>;

interface QuestionItem {
  text: string;
  question_type: QuestionType;
  options: string[];
  required: boolean;
  position: number;
}

export function SurveyForm() {
  const router = useRouter();
  const createMut = useCreateSurvey();
  const [surveyType, setSurveyType] = useState<string>("CSAT");
  const [targetType, setTargetType] = useState<string>("all");
  const [targetOrgIds, setTargetOrgIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const targetLabel: Record<string, string> = { all: "Tất cả", specific: "Chọn tổ chức" };
  const questionTypeLabel: Record<string, string> = { rating: "Đánh giá", text: "Văn bản", single_choice: "Chọn 1", multiple_choice: "Chọn nhiều" };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
  });

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        question_type: "rating",
        options: [],
        required: true,
        position: prev.length + 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionItem, value: unknown) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const onSubmit = async (data: SurveyFormValues) => {
    if (questions.length === 0) {
      toast.error("Cần ít nhất 1 câu hỏi");
      return;
    }
    try {
      await createMut.mutateAsync({
        title: data.title,
        survey_type: surveyType as "CSAT" | "NPS" | "CES",
        description: data.description || "",
        target_type: targetType as "all" | "specific",
        target_organization_ids: targetType === "specific" ? targetOrgIds : [],
        questions,
      });
      toast.success("Tạo khảo sát thành công");
      router.push("/surveys");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tạo khảo sát thất bại");
    }
  };

  const watchedTitle = watch("title", "");
  const watchedDescription = watch("description", "");

  return (
    <div className="flex gap-6">
      {/* Left: Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-w-0 flex-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khảo sát</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Mô tả</Label>
              <Textarea id="desc" rows={3} {...register("description")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Loại khảo sát</Label>
                <Select value={surveyType} onValueChange={(v) => { if (v) setSurveyType(v); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSAT">CSAT</SelectItem>
                    <SelectItem value="NPS">NPS</SelectItem>
                    <SelectItem value="CES">CES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Đối tượng</Label>
                <Select value={targetType} onValueChange={(v) => { if (v) setTargetType(v); }}>
                  <SelectTrigger>
                    <SelectValue>{targetLabel[targetType]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="specific">Chọn tổ chức</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {targetType === "specific" && (
              <OrganizationSelector
                selectedIds={targetOrgIds}
                onChange={setTargetOrgIds}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Câu hỏi ({questions.length})</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="mr-1 h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Chưa có câu hỏi. Nhấn &quot;Thêm câu hỏi&quot; để bắt đầu.
              </p>
            )}
            {questions.map((q, idx) => (
              <div key={idx} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Câu hỏi ${idx + 1}`}
                      value={q.text}
                      onChange={(e) => updateQuestion(idx, "text", e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Select
                    value={q.question_type}
                    onValueChange={(v) => { if (v) updateQuestion(idx, "question_type", v); }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue>{questionTypeLabel[q.question_type]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Đánh giá</SelectItem>
                      <SelectItem value="text">Văn bản</SelectItem>
                      <SelectItem value="single_choice">Chọn 1</SelectItem>
                      <SelectItem value="multiple_choice">Chọn nhiều</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={q.required}
                      onCheckedChange={(c) => updateQuestion(idx, "required", !!c)}
                    />
                    Bắt buộc
                  </label>
                </div>
                {(q.question_type === "single_choice" || q.question_type === "multiple_choice") && (
                  <OptionListEditor
                    options={q.options}
                    onChange={(opts) => updateQuestion(idx, "options", opts)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo khảo sát"
            )}
          </Button>
        </div>
      </form>

      {/* Right: Live preview */}
      <div className="w-[440px] shrink-0">
        <SurveyPreviewPanel
          data={{
            title: watchedTitle || "",
            survey_type: surveyType as SurveyType,
            description: watchedDescription,
            questions: questions.map((q, i) => ({ ...q, id: i })),
          }}
        />
      </div>
    </div>
  );
}

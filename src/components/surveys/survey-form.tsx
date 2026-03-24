"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useCreateSurvey } from "@/hooks/use-surveys";
import { useRouter } from "next/navigation";
import type { SurveyType } from "@/types/survey";

const questionSchema = z.object({
  text: z.string().min(1, "Câu hỏi không được để trống"),
  type: z.enum(["rating", "text", "multiple_choice", "single_choice"]),
  required: z.boolean(),
});

const surveyFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  type: z.enum(["CSAT", "CES", "NPS"]),
  description: z.string().min(1, "Mô tả không được để trống"),
  triggerPoint: z.string().min(1, "Điểm kích hoạt không được để trống"),
  questions: z.array(questionSchema).min(1, "Cần ít nhất 1 câu hỏi"),
});

type SurveyFormValues = z.infer<typeof surveyFormSchema>;

export function SurveyForm() {
  const router = useRouter();
  const createSurvey = useCreateSurvey();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SurveyFormValues>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: {
      title: "",
      type: "CSAT",
      description: "",
      triggerPoint: "",
      questions: [{ text: "", type: "rating", required: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data: SurveyFormValues) => {
    await createSurvey.mutateAsync(data);
    router.push("/surveys");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin khảo sát</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" {...register("title")} placeholder="Nhập tiêu đề khảo sát" />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại khảo sát</Label>
              <Select
                value={watch("type")}
                onValueChange={(v) => setValue("type", v as SurveyType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSAT">CSAT</SelectItem>
                  <SelectItem value="CES">CES</SelectItem>
                  <SelectItem value="NPS">NPS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="triggerPoint">Điểm kích hoạt</Label>
              <Input
                id="triggerPoint"
                {...register("triggerPoint")}
                placeholder="VD: post_purchase"
              />
              {errors.triggerPoint && (
                <p className="text-sm text-destructive">{errors.triggerPoint.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Mô tả khảo sát"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Câu hỏi</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ text: "", type: "rating", required: true })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm câu hỏi
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.questions?.root && (
            <p className="text-sm text-destructive">{errors.questions.root.message}</p>
          )}
          {fields.map((field, index) => (
            <SurveyQuestionField
              key={field.id}
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/surveys")}>
          Hủy
        </Button>
        <Button type="submit" disabled={createSurvey.isPending}>
          {createSurvey.isPending ? "Đang tạo..." : "Tạo khảo sát"}
        </Button>
      </div>
    </form>
  );
}

interface QuestionFieldProps {
  index: number;
  register: ReturnType<typeof useForm<SurveyFormValues>>["register"];
  watch: ReturnType<typeof useForm<SurveyFormValues>>["watch"];
  setValue: ReturnType<typeof useForm<SurveyFormValues>>["setValue"];
  errors: ReturnType<typeof useForm<SurveyFormValues>>["formState"]["errors"];
  onRemove: () => void;
  canRemove: boolean;
}

function SurveyQuestionField({
  index,
  register,
  watch,
  setValue,
  errors,
  onRemove,
  canRemove,
}: QuestionFieldProps) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Câu hỏi {index + 1}</span>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>

      <Input
        {...register(`questions.${index}.text`)}
        placeholder="Nhập nội dung câu hỏi"
      />
      {errors.questions?.[index]?.text && (
        <p className="text-sm text-destructive">
          {errors.questions[index].text?.message}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Select
          value={watch(`questions.${index}.type`)}
          onValueChange={(v) =>
            setValue(`questions.${index}.type`, v as SurveyFormValues["questions"][number]["type"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Đánh giá</SelectItem>
            <SelectItem value="text">Văn bản</SelectItem>
            <SelectItem value="single_choice">Chọn một</SelectItem>
            <SelectItem value="multiple_choice">Chọn nhiều</SelectItem>
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={watch(`questions.${index}.required`)}
            onCheckedChange={(checked) =>
              setValue(`questions.${index}.required`, checked === true)
            }
          />
          Bắt buộc
        </label>
      </div>
    </div>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { QuestionType } from "@/types/survey";

export interface PreviewQuestion {
  id: number | string;
  text: string;
  question_type: QuestionType;
  options: string[];
  required: boolean;
}

export function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: PreviewQuestion;
  value: string | number | string[] | undefined;
  onChange: (val: string | number | string[]) => void;
}) {
  switch (question.question_type) {
    case "rating": {
      const current = typeof value === "number" ? value : 0;
      const max = 5;
      return (
        <div className="flex gap-2">
          {Array.from({ length: max }, (_, i) => i + 1).map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                current === score
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      );
    }
    case "text":
      return (
        <Textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập câu trả lời..."
          rows={3}
        />
      );
    case "single_choice":
      return (
        <div className="space-y-2">
          {question.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <Input
                type="radio"
                name={`q-${question.id}`}
                className="h-4 w-4"
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    case "multiple_choice": {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          {question.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selected.includes(opt)}
                onCheckedChange={(checked) => {
                  onChange(
                    checked
                      ? [...selected, opt]
                      : selected.filter((s) => s !== opt)
                  );
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

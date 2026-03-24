"use client";

import { SurveyForm } from "@/components/surveys/survey-form";

export default function CreateSurveyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tạo khảo sát mới</h1>
        <p className="text-sm text-muted-foreground">
          Thiết lập khảo sát để thu thập phản hồi khách hàng
        </p>
      </div>
      <SurveyForm />
    </div>
  );
}

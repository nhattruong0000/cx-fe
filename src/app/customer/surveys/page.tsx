"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CustomerSurveyCard } from "@/components/customer/survey-card";
import { useCustomerSurveys } from "@/hooks/use-surveys";

export default function CustomerSurveysPage() {
  const { data: surveys, isLoading } = useCustomerSurveys();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Khảo sát</h1>
        <p className="text-sm text-muted-foreground">
          Các khảo sát cần phản hồi
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !surveys?.length ? (
        <p className="py-8 text-center text-muted-foreground">
          Không có khảo sát nào cần phản hồi
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {surveys.map((survey) => (
            <CustomerSurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      )}
    </div>
  );
}

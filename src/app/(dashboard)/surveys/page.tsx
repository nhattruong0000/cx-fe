"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SurveyListTable } from "@/components/surveys/survey-list-table";
import { Plus } from "lucide-react";

export default function SurveysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Khảo sát</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý khảo sát CSAT, CES, NPS
          </p>
        </div>
        <Button render={<Link href="/surveys/create" />}>
          <Plus className="mr-1 h-4 w-4" />
          Tạo khảo sát
        </Button>
      </div>
      <SurveyListTable />
    </div>
  );
}

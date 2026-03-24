"use client";

import type { SurveyType } from "@/types/survey";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const typeStyles: Record<SurveyType, string> = {
  CSAT: "bg-blue-100 text-blue-700 border-blue-200",
  CES: "bg-green-100 text-green-700 border-green-200",
  NPS: "bg-purple-100 text-purple-700 border-purple-200",
};

interface SurveyTypeBadgeProps {
  type: SurveyType;
  className?: string;
}

export function SurveyTypeBadge({ type, className }: SurveyTypeBadgeProps) {
  return (
    <Badge variant="outline" className={cn(typeStyles[type], className)}>
      {type}
    </Badge>
  );
}

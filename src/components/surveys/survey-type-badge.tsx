"use client";

import { Badge } from "@/components/ui/badge";
import type { SurveyType } from "@/types/survey";

const typeConfig: Record<SurveyType, { label: string; variant: "default" | "secondary" | "outline" }> = {
  CSAT: { label: "CSAT", variant: "default" },
  NPS: { label: "NPS", variant: "secondary" },
  CES: { label: "CES", variant: "outline" },
};

export function SurveyTypeBadge({ type }: { type: SurveyType }) {
  const config = typeConfig[type];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

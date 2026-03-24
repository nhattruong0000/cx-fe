"use client";

import type { FunnelStage as FunnelStageType } from "@/types/journey";
import { FunnelStage } from "./funnel-stage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JourneyFunnelProps {
  stages: FunnelStageType[];
}

export function JourneyFunnel({ stages }: JourneyFunnelProps) {
  const maxCount = stages[0]?.count ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Phễu chuyển đổi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((stage, index) => (
          <FunnelStage
            key={stage.name}
            stage={stage}
            maxCount={maxCount}
            previousCount={index > 0 ? stages[index - 1].count : undefined}
          />
        ))}
      </CardContent>
    </Card>
  );
}

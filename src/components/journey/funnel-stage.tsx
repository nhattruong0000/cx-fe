"use client";

import type { FunnelStage as FunnelStageType } from "@/types/journey";
import { formatNumber } from "@/lib/utils";

interface FunnelStageProps {
  stage: FunnelStageType;
  maxCount: number;
  previousCount?: number;
}

export function FunnelStage({ stage, maxCount, previousCount }: FunnelStageProps) {
  const widthPercent = Math.max((stage.count / maxCount) * 100, 10);
  const dropOff = previousCount ? Math.round(((previousCount - stage.count) / previousCount) * 100) : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="w-40 shrink-0 text-right">
        <p className="text-sm font-medium">{stage.name}</p>
        <p className="text-xs text-muted-foreground">{formatNumber(stage.count)}</p>
      </div>
      <div className="flex-1">
        <div
          className="h-10 rounded-r-md bg-[var(--primary-500,#3B82F6)] transition-all"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <div className="w-20 shrink-0 text-sm">
        {previousCount ? (
          <span className="text-red-500">-{dropOff}%</span>
        ) : (
          <span className="text-muted-foreground">100%</span>
        )}
      </div>
    </div>
  );
}

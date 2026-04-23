"use client";

// Single KPI stat card — matches design .pen rCNXg/Ef9rf with variant top-border + icon tint.

import { Info, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Variant = "primary" | "destructive" | "warning" | "success";

type Props = {
  label: string;
  value: string | number;
  suffix?: string;
  /** ⓘ tooltip content (formula explanation) */
  tooltipContent?: React.ReactNode;
  /** Optional small caption below value (e.g. "Quá ETA", "so với tuần trước") */
  delta?: string;
  icon?: LucideIcon;
  /** Variant drives top-border accent + icon color per design */
  variant?: Variant;
  isLoading?: boolean;
  error?: string;
};

const TOP_BORDER_CLASS: Record<Variant, string> = {
  primary: "border-t-primary",
  destructive: "border-t-destructive",
  warning: "border-t-yellow-500",
  success: "border-t-green-600",
};

const ICON_COLOR_CLASS: Record<Variant, string> = {
  primary: "text-primary",
  destructive: "text-destructive",
  warning: "text-yellow-500",
  success: "text-green-600",
};

export function KpiStatCard({
  label,
  value,
  suffix,
  tooltipContent,
  delta,
  icon: Icon,
  variant = "primary",
  isLoading,
  error,
}: Props) {
  return (
    <Card className={`bg-card border-t-[3px] ${TOP_BORDER_CLASS[variant]}`}>
      <CardContent className="p-6">
        {/* Label + icon row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{label}</span>
            {tooltipContent && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    className="inline-flex items-center text-muted-foreground hover:text-foreground"
                    aria-label="Xem công thức"
                  >
                    <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    {tooltipContent}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {Icon && (
            <Icon className={`h-5 w-5 shrink-0 ${ICON_COLOR_CLASS[variant]}`} />
          )}
        </div>

        {/* Value */}
        <div className="mt-3 min-h-[2rem]">
          {isLoading && (
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          )}
          {!isLoading && error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
          {!isLoading && !error && (
            <p className="text-[28px] font-bold leading-none text-foreground">
              {value}
              {suffix && (
                <span className="ml-0.5 text-sm font-normal text-muted-foreground">
                  {suffix}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Delta caption */}
        {delta && !isLoading && !error && (
          <p className="mt-2 text-xs text-muted-foreground">{delta}</p>
        )}
      </CardContent>
    </Card>
  );
}

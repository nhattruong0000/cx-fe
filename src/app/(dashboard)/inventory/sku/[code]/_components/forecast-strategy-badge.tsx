"use client";

/**
 * ForecastStrategyBadge — shown when the SKU is on a non-full forecast strategy,
 * indicating new-launch, category-analog, or manual handling.
 * Renders null when strategy is "full" (normal operation) or not provided.
 */

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { ForecastStrategy } from "@/types/inventory-evidence";

// ─── Config ───────────────────────────────────────────────────────────────────

const STRATEGY_CFG: Record<
  Exclude<ForecastStrategy, "full">,
  { label: string; tooltip: string; variant: "secondary" | "warning" | "outline" }
> = {
  manual: {
    label: "Target PM (mới launch)",
    tooltip:
      "SKU mới — dự báo dùng target thủ công từ PM. Hệ thống chưa đủ lịch sử để tự tính.",
    variant: "warning",
  },
  category_analog: {
    label: "SKU mới — dự báo theo category",
    tooltip:
      "Chưa đủ lịch sử bán riêng. Hệ thống dùng tỷ lệ bán trung bình của nhóm hàng làm tham chiếu.",
    variant: "secondary",
  },
  blend: {
    label: "Mix own + category",
    tooltip:
      "Kết hợp lịch sử bán của SKU với dữ liệu nhóm hàng. Dùng khi lịch sử riêng còn ít tuần.",
    variant: "outline",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ForecastStrategyBadgeProps {
  strategy: ForecastStrategy | undefined | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ForecastStrategyBadge({ strategy }: ForecastStrategyBadgeProps) {
  if (!strategy || strategy === "full") return null;

  const cfg = STRATEGY_CFG[strategy];
  if (!cfg) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="inline-flex cursor-help items-center" aria-label={cfg.tooltip}>
          <Badge variant={cfg.variant}>
            {cfg.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {cfg.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

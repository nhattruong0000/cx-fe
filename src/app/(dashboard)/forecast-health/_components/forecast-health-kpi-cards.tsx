"use client";

import { ActivityIcon, AlertTriangleIcon, CheckCircleIcon, GaugeIcon } from "lucide-react";
import type { ForecastHealthCounts } from "../_types/forecast-health";

type Props = {
  counts: ForecastHealthCounts | undefined;
  isLoading: boolean;
};

const CARD_BASE =
  "flex flex-col gap-2 rounded-[14px] border border-border bg-card p-5 shadow-[0_1px_3px_#0000000A]";

export function ForecastHealthKpiCards({ counts, isLoading }: Props) {
  const c = counts;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Tổng SKUs forecasted"
        value={isLoading ? "…" : String(c?.total ?? 0)}
        helper="Active forecast rows"
        icon={<ActivityIcon className="size-5 text-primary" />}
        accent="border-t-4 border-t-primary"
      />
      <KpiCard
        label="Có confidence (backtest)"
        value={isLoading ? "…" : String(c?.with_confidence ?? 0)}
        helper="≥ 4 datapoints accumulated"
        icon={<CheckCircleIcon className="size-5 text-[#16A34A]" />}
        accent="border-t-4 border-t-[#16A34A]"
      />
      <KpiCard
        label="Insufficient data"
        value={isLoading ? "…" : String(c?.insufficient_data ?? 0)}
        helper="< 4 datapoints — confidence NULL"
        icon={<GaugeIcon className="size-5 text-[#F59E0B]" />}
        accent="border-t-4 border-t-[#F59E0B]"
      />
      <KpiCard
        label="WMAPE > 50% flagged"
        value={isLoading ? "…" : String(c?.flagged_high_wmape ?? 0)}
        helper="High forecast error — investigate"
        icon={<AlertTriangleIcon className="size-5 text-[#DC2626]" />}
        accent="border-t-4 border-t-[#DC2626]"
      />
    </div>
  );
}

function KpiCard(props: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className={`${CARD_BASE} ${props.accent}`}>
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-muted-foreground">{props.label}</span>
        {props.icon}
      </div>
      <div className="text-3xl font-bold text-foreground">{props.value}</div>
      <div className="text-xs text-muted-foreground">{props.helper}</div>
    </div>
  );
}

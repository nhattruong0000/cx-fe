"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useAggregateDashboard } from "./_hooks/use-aggregate-dashboard";
import { AggregateTabCashFlow } from "./_components/aggregate-tab-cash-flow";
import { AggregateTabInventoryBudget } from "./_components/aggregate-tab-inventory-budget";
import { AggregateTabKpiReport } from "./_components/aggregate-tab-kpi-report";
import { AggregateTabTrend } from "./_components/aggregate-tab-trend";
import { AggregateTabForecastHealth } from "./_components/aggregate-tab-forecast-health";

type TabKey = "cash_flow" | "inventory_budget" | "kpi_report" | "trend_analysis" | "forecast_health";

const TABS: { key: TabKey; label: string }[] = [
  { key: "cash_flow", label: "Cash Flow" },
  { key: "inventory_budget", label: "Inventory Budget" },
  { key: "kpi_report", label: "KPI Report" },
  { key: "trend_analysis", label: "Trend Analysis" },
  { key: "forecast_health", label: "Forecast Health" },
];

export default function AggregateForecastsPage() {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = React.useState<TabKey>("cash_flow");

  React.useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [authUser, router]);

  const { data, isLoading, error } = useAggregateDashboard();

  if (authUser && authUser.role !== "admin") return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dự báo tổng hợp</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cash flow + Inventory budget + KPI + Trend per period — Admin only. Cập nhật:{" "}
          {data?.generated_at
            ? new Date(data.generated_at).toLocaleString("vi-VN")
            : "—"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === t.key
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {activeTab === t.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {error ? (
        <div className="rounded-[14px] border border-[#DC2626] bg-destructive-light p-6 text-sm text-[#DC2626]">
          Lỗi tải dữ liệu: {(error as Error).message}
        </div>
      ) : isLoading || !data ? (
        <div className="rounded-[14px] border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Đang tải dữ liệu aggregate forecasts...
        </div>
      ) : (
        <>
          {activeTab === "cash_flow" && (
            <AggregateTabCashFlow section={data.sections.cash_flow} />
          )}
          {activeTab === "inventory_budget" && (
            <AggregateTabInventoryBudget section={data.sections.inventory_budget} />
          )}
          {activeTab === "kpi_report" && (
            <AggregateTabKpiReport section={data.sections.kpi_report} />
          )}
          {activeTab === "trend_analysis" && (
            <AggregateTabTrend section={data.sections.trend_analysis} />
          )}
          {activeTab === "forecast_health" && (
            <AggregateTabForecastHealth section={data.sections.forecast_health} />
          )}
        </>
      )}
    </div>
  );
}

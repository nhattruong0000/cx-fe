"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useForecastHealth } from "./_hooks/use-forecast-health";
import { ForecastHealthKpiCards } from "./_components/forecast-health-kpi-cards";
import { ForecastHealthToolbar } from "./_components/forecast-health-toolbar";
import { ForecastHealthTable } from "./_components/forecast-health-table";

export default function ForecastHealthPage() {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const [search, setSearch] = React.useState("");
  const [classification, setClassification] = React.useState("all");
  const [branch, setBranch] = React.useState("all");

  // Admin-only page guard
  React.useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [authUser, router]);

  const { data, isLoading, error } = useForecastHealth();

  const branches = React.useMemo(
    () => data?.scope?.branch_ids ?? [],
    [data]
  );

  const filteredRows = React.useMemo(() => {
    const all = data?.data ?? [];
    return all.filter((r) => {
      if (branch !== "all" && r.branch_id !== branch) return false;
      if (
        search &&
        !r.item_code.toLowerCase().includes(search.toLowerCase()) &&
        !r.stock_code.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      // classification filter not available on this endpoint — placeholder for future BE expansion
      if (classification !== "all") return true;
      return true;
    });
  }, [data, search, branch, classification]);

  if (authUser && authUser.role !== "admin") return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Forecast Health</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi chất lượng forecast — admin only. Cập nhật:{" "}
            {data?.generated_at ? new Date(data.generated_at).toLocaleString("vi-VN") : "—"}
          </p>
        </div>
      </div>

      <ForecastHealthKpiCards counts={data?.counts} isLoading={isLoading} />

      <ForecastHealthToolbar
        search={search}
        onSearchChange={setSearch}
        classificationFilter={classification}
        onClassificationChange={setClassification}
        branchFilter={branch}
        onBranchChange={setBranch}
        branches={branches}
      />

      {error ? (
        <div className="rounded-[14px] border border-[#DC2626] bg-destructive-light p-6 text-sm text-[#DC2626]">
          Lỗi tải dữ liệu: {(error as Error).message}
        </div>
      ) : (
        <ForecastHealthTable rows={filteredRows} isLoading={isLoading} />
      )}
    </div>
  );
}

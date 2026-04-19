"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { CriticalAlertsBanner } from "./_components/critical-alerts-banner";
import { InventoryFilters } from "./_components/inventory-filters";
import { StockStatusGrid } from "./_components/stock-status-grid";
import { AlertSummaryDonut } from "./_components/alert-summary-donut";
import { ForecastHorizonsChart } from "./_components/forecast-horizons-chart";
import { PoPipelineCard } from "./_components/po-pipeline-card";
import { SupplierCadenceCard } from "./_components/supplier-cadence-card";

const ALLOWED_ROLES = new Set(["admin", "staff"]);

export default function InventoryDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();

  const role = user?.role;
  const isAdmin = role === "admin";
  const allowed = role ? ALLOWED_ROLES.has(role) : false;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (role && !allowed) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, role, allowed, router]);

  if (isLoading || !isAuthenticated || !allowed) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#09090B]">Kho & Dự báo</h1>
        <p className="text-sm text-muted-foreground">
          Giám sát tồn kho, cảnh báo và dự báo nhu cầu.
        </p>
      </div>

      <CriticalAlertsBanner />
      <InventoryFilters />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StockStatusGrid />
        </div>
        <div>
          <AlertSummaryDonut />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ForecastHorizonsChart />
        <PoPipelineCard />
      </div>

      {isAdmin && <SupplierCadenceCard />}
    </div>
  );
}

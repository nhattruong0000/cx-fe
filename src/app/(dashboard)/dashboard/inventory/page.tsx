"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { DashboardHeader } from "./_components/summary/dashboard-header";
import { DataStalenessBanner } from "./_components/summary/data-staleness-banner";
import { HeroKpisRow } from "./_components/summary/hero-kpis-row";
import { BreakdownRow } from "./_components/summary/breakdown-row";
import { TopListsRow } from "./_components/summary/top-lists-row";
import { DashboardFooter } from "./_components/summary/dashboard-footer";

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
    <div className="min-h-full space-y-6">
      {/* Row 0: header */}
      <DashboardHeader />

      {/* Data staleness warning — shown when snapshot_at > 24h old (m5) */}
      <DataStalenessBanner />

      {/* Row 1: 4 hero KPI cards */}
      <HeroKpisRow />

      {/* Row 2: alerts donut + stock health bar */}
      <BreakdownRow />

      {/* Row 3: top-10 lists (risky SKUs | POs | suppliers[admin]) */}
      <TopListsRow isAdmin={isAdmin} />

      {/* Footer: last updated + refresh */}
      <DashboardFooter />
    </div>
  );
}

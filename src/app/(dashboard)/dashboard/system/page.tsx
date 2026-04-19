"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AmisSyncStatusCard } from "./_components/amis-sync-status-card";
import { LastSyncEntityTable } from "./_components/last-sync-entity-table";
import { ProxyPoolHealthCard } from "./_components/proxy-pool-health-card";
import { SyncErrorRateChart } from "./_components/sync-error-rate-chart";
import { UserSessionStats } from "./_components/user-session-stats";

export default function SystemDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, isAdmin, router]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#09090B]">Hệ thống</h1>
        <p className="text-sm text-muted-foreground">
          Giám sát đồng bộ AMIS, proxy pool, lỗi và thống kê người dùng.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AmisSyncStatusCard />
        <ProxyPoolHealthCard />
        <div className="lg:col-span-1">
          <UserSessionStats />
        </div>
      </div>

      <LastSyncEntityTable />

      <SyncErrorRateChart />
    </div>
  );
}

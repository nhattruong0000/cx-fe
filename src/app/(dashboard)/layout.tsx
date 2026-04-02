"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopBar } from "@/components/layout/dashboard-top-bar";
import { DashboardSkeleton } from "./dashboard/dashboard-skeleton";
import { DashboardError } from "./dashboard/dashboard-error";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import type { UserRole } from "@/types/dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Redirect to login when auth is done loading but no user (expired/logged out)
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // Show skeleton only when no user yet AND still loading
  // If user exists (from persist), render immediately — AuthProvider re-validates in background
  if (!user) {
    if (isLoading) {
      return (
        <div className="flex min-h-screen">
          <div className="flex-1 bg-white p-8">
            <DashboardSkeleton />
          </div>
        </div>
      );
    }
    // Auth done, no user — useEffect will redirect, show skeleton during transition
    return (
      <div className="flex h-screen">
        <div className="w-[260px] shrink-0 bg-[#F8FAFC]" />
        <div className="flex-1 bg-white p-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const role = user.role as UserRole;

  // All roles: sidebar full-height left + topbar inside main area
  return (
    <div className="flex h-screen bg-[#F4F4F5]">
      <DashboardSidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopBar />
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <ErrorBoundary fallback={<DashboardError message="Something went wrong" />}>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

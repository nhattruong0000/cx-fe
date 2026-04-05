"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopBar } from "@/components/layout/dashboard-top-bar";
import { DashboardSkeleton } from "./dashboard/dashboard-skeleton";
import { DashboardError } from "./dashboard/dashboard-error";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import type { UserRole } from "@/types/dashboard";

/** Track Zustand persist hydration — SSR-safe (persist API unavailable on server) */
function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    } else {
      return useAuthStore.persist.onFinishHydration(() => setHasHydrated(true));
    }
  }, []);

  return hasHydrated;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const hasHydrated = useHasHydrated();

  // Redirect to login when auth is done loading but no user (expired/logged out)
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // Wait for Zustand persist to rehydrate from sessionStorage
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 bg-white p-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Wait for AuthProvider to finish validating session before rendering dashboard.
  // Without this, stale user from sessionStorage renders the full UI briefly
  // before AuthProvider detects an expired session and calls logout().
  if (isLoading || !user) {
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
        <main className="flex flex-1 flex-col overflow-y-auto bg-white p-8">
          <ErrorBoundary fallback={<DashboardError message="Something went wrong" />}>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { StaffSidebar } from "@/components/layout/staff-sidebar";
import { StaffHeader } from "@/components/layout/staff-header";
import { useSidebarStore } from "@/stores/sidebar-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrate = useSidebarStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block">
        <StaffSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <StaffHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

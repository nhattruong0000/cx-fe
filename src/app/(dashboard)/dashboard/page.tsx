"use client";

import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import { AdminDashboard } from "./admin-dashboard";
import { StaffDashboard } from "./staff-dashboard";
import { CustomerDashboard } from "./customer-dashboard";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { DashboardError } from "./dashboard-error";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) return <DashboardError />;

  switch (data.role) {
    case "admin":
      return <AdminDashboard data={data} />;
    case "staff":
      return <StaffDashboard data={data} />;
    case "customer":
      return <CustomerDashboard data={data} />;
    default:
      return <DashboardError message="Unknown role" />;
  }
}

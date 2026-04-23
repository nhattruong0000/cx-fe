"use client";

// Banner shown at top of dashboard when snapshot_at (generated_at) is older than threshold.
// Threshold + message sourced from dashboard-constants to keep config in one place.

import { AlertTriangle } from "lucide-react";
import {
  DASHBOARD_STALENESS_THRESHOLD_MS,
  buildStalenessMessage,
} from "@/lib/dashboard-constants";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";

/** Compute hours elapsed since an ISO timestamp, rounded down */
function hoursElapsed(isoString: string): number {
  const elapsed = Date.now() - new Date(isoString).getTime();
  return Math.floor(elapsed / (60 * 60 * 1000));
}

/** Returns true if the snapshot is older than DASHBOARD_STALENESS_THRESHOLD_MS */
function isStale(isoString: string): boolean {
  return Date.now() - new Date(isoString).getTime() > DASHBOARD_STALENESS_THRESHOLD_MS;
}

/**
 * Renders a warning banner when dashboard data is stale (> 24h).
 * Renders nothing when data is fresh, loading, or errored.
 */
export function DataStalenessBanner() {
  const { data, isLoading } = useInventoryDashboardSummary();

  // Don't render during load or if no data
  if (isLoading || !data?.generated_at) return null;

  // Don't render if data is fresh
  if (!isStale(data.generated_at)) return null;

  const hours = hoursElapsed(data.generated_at);
  const message = buildStalenessMessage(hours);

  return (
    <div
      role="alert"
      className="flex items-center gap-2 rounded-[10px] border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-warning"
    >
      <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

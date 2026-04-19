"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { useOpsSyncStatus } from "../_hooks/use-ops-sync-status";

const CIRCUIT_VARIANT: Record<string, "secondary" | "destructive" | "outline"> = {
  closed: "secondary",
  open: "destructive",
  half_open: "outline",
};

const CIRCUIT_LABEL: Record<string, string> = {
  closed: "Đóng (khỏe)",
  open: "Mở (ngắt mạch)",
  half_open: "Bán mở",
};

export function ProxyPoolHealthCard() {
  const { data, isLoading, error } = useOpsSyncStatus();
  const pool = data?.proxy_pool;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tình trạng proxy pool</CardTitle>
        <p className="text-xs text-muted-foreground">
          Active / cooling · trạng thái circuit breaker
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && !data && (
          <p className="py-4 text-sm text-muted-foreground">Đang tải…</p>
        )}
        {error && (
          <p className="py-4 text-sm text-red-600">Không tải được dữ liệu.</p>
        )}
        {pool && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {pool.active_count}
              </p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Cooling</p>
              <p className="text-2xl font-semibold text-amber-600">
                {pool.cooling_count}
              </p>
            </div>
            <div className="col-span-2 rounded-md border p-3">
              <p className="mb-1 text-xs text-muted-foreground">Circuit state</p>
              <Badge variant={CIRCUIT_VARIANT[pool.circuit_state] ?? "outline"}>
                {CIRCUIT_LABEL[pool.circuit_state] ?? pool.circuit_state}
              </Badge>
            </div>
            <div className="col-span-2 rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Saturation 24h</p>
              <p className="text-lg font-semibold">
                {pool.saturation_events_24h ?? "—"}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  sự kiện
                </span>
              </p>
              {pool.last_saturation_at && (
                <p className="text-xs text-muted-foreground">
                  Gần nhất: {formatRelativeTime(pool.last_saturation_at)}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

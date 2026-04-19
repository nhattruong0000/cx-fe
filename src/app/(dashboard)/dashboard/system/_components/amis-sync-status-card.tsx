"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { useOpsSyncStatus } from "../_hooks/use-ops-sync-status";

type Status = "green" | "yellow" | "red";

function resolveStatus(
  enabled: boolean,
  tokenCached: boolean
): { level: Status; label: string } {
  if (!enabled) return { level: "red", label: "Vô hiệu hóa" };
  if (!tokenCached) return { level: "yellow", label: "Token chưa cache" };
  return { level: "green", label: "Hoạt động" };
}

const DOT_COLOR: Record<Status, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
};

export function AmisSyncStatusCard() {
  const { data, isLoading, error } = useOpsSyncStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái đồng bộ AMIS</CardTitle>
        <p className="text-xs text-muted-foreground">
          Nguồn: <code>/ops/sync_status</code> · tự động làm mới 30s
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && !data && (
          <p className="py-4 text-sm text-muted-foreground">Đang tải…</p>
        )}
        {error && (
          <p className="py-4 text-sm text-red-600">
            Không tải được trạng thái đồng bộ.
          </p>
        )}
        {data && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className={`inline-block h-4 w-4 rounded-full ${
                  DOT_COLOR[resolveStatus(data.sync.enabled, data.sync.token_cached).level]
                }`}
                aria-hidden
              />
              <div>
                <p className="text-lg font-semibold">
                  {resolveStatus(data.sync.enabled, data.sync.token_cached).label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Token cache:{" "}
                  {data.sync.token_cached ? (
                    <Badge variant="secondary">Đã cache</Badge>
                  ) : (
                    <Badge variant="outline">Chưa cache</Badge>
                  )}
                  {data.sync.token_cache_ttl_seconds != null && (
                    <span className="ml-2">
                      TTL {data.sync.token_cache_ttl_seconds}s
                    </span>
                  )}
                </p>
              </div>
            </div>

            {data.sync.disabled_reason && (
              <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                Lý do vô hiệu hóa: {data.sync.disabled_reason}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Lần 401 gần nhất:{" "}
              <span className="text-foreground">
                {data.sync.last_401_at
                  ? formatRelativeTime(data.sync.last_401_at)
                  : "Chưa có"}
              </span>
            </div>

            <a
              href="https://help.amis.vn"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs font-medium text-blue-600 hover:underline"
            >
              Xem docs AMIS →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

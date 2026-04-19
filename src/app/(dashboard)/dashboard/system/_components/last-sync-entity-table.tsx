"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { formatNumber } from "../../inventory/_components/inventory-format-utils";
import { useOpsSyncStatus } from "../_hooks/use-ops-sync-status";

export function LastSyncEntityTable() {
  const { data, isLoading, error } = useOpsSyncStatus();
  const rows = data?.last_sync_per_entity ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lần đồng bộ gần nhất theo thực thể</CardTitle>
        <p className="text-xs text-muted-foreground">
          Ngưỡng stale: 1 giờ · {rows.length} thực thể
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && !data && (
          <p className="py-4 text-sm text-muted-foreground">Đang tải…</p>
        )}
        {error && (
          <p className="py-4 text-sm text-red-600">Không tải được dữ liệu.</p>
        )}
        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">Thực thể</th>
                  <th className="py-2 pr-3">Đồng bộ gần nhất</th>
                  <th className="py-2 pr-3">Trạng thái</th>
                  <th className="py-2 pr-3 text-right">Số bản ghi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.entity}
                    className={`border-b last:border-b-0 ${
                      r.stale ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="py-2 pr-3 font-medium">{r.entity}</td>
                    <td className="py-2 pr-3 text-xs">
                      {r.last_synced_at
                        ? formatRelativeTime(r.last_synced_at)
                        : "—"}
                    </td>
                    <td className="py-2 pr-3">
                      {r.stale ? (
                        <Badge variant="destructive">Stale</Badge>
                      ) : (
                        <Badge variant="secondary">Mới</Badge>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {formatNumber(r.record_count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

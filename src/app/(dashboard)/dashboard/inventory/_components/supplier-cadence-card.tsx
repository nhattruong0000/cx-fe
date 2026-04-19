"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStockStatus } from "../_hooks/use-stock-status";
import { useInventoryDashboardStore } from "../_store/inventory-dashboard-store";
import { formatDays, formatNumber } from "./inventory-format-utils";

/** Warning when days_since_last_inward > avg_gap + 2 * stdev. */
function isCadenceOverdue(
  avg: number | null,
  stdev: number | null,
  since: number | null
): boolean {
  if (avg === null || since === null) return false;
  const threshold = avg + 2 * (stdev ?? 0);
  return since > threshold;
}

export function SupplierCadenceCard() {
  const { selectedSku, branchFilter } = useInventoryDashboardStore();

  const { data, isLoading } = useStockStatus(selectedSku, {
    branch_id: branchFilter ?? undefined,
    diagnostics: true,
  });

  const cadence = data?.inward_cadence;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhịp cung ứng (admin)</CardTitle>
        <p className="text-xs text-muted-foreground">
          {selectedSku ? `SKU: ${selectedSku}` : "Chọn SKU để xem dữ liệu"}
        </p>
      </CardHeader>
      <CardContent>
        {!selectedSku && (
          <p className="py-6 text-sm text-muted-foreground">Chưa chọn SKU.</p>
        )}
        {selectedSku && isLoading && (
          <p className="py-6 text-sm text-muted-foreground">Đang tải…</p>
        )}
        {selectedSku && !isLoading && !cadence && (
          <p className="py-6 text-sm text-muted-foreground">
            Không có dữ liệu cadence (diagnostics cần role admin).
          </p>
        )}
        {cadence && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Khoảng cách TB" value={formatDays(cadence.avg_gap_days)} />
            <Metric
              label="Độ lệch chuẩn"
              value={
                cadence.stdev_gap_days !== null
                  ? `${formatNumber(cadence.stdev_gap_days, 1)} ngày`
                  : "—"
              }
            />
            <Metric
              label="Ngày kể từ lần nhập cuối"
              value={formatDays(cadence.days_since_last_inward)}
            />
            <Metric
              label="Số mẫu"
              value={cadence.sample_size !== null ? String(cadence.sample_size) : "—"}
            />
            <div className="col-span-2">
              {isCadenceOverdue(
                cadence.avg_gap_days,
                cadence.stdev_gap_days,
                cadence.days_since_last_inward
              ) ? (
                <Badge variant="warning">Cung ứng chậm bất thường</Badge>
              ) : (
                <Badge variant="success">Nhịp cung ứng bình thường</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border bg-muted/30 p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

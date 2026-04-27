"use client";

/**
 * Lead Time tab — đơn giản, 1 số chính + caption nguồn + per-vendor history.
 *
 * Precedence hiển thị:
 *   - override → "X ngày" + "(theo khai báo)"
 *   - measured/default → "X ngày" + "(ước tính từ lịch sử)" hoặc "Trong ngày" nếu = 0
 *   - không có dữ liệu → empty state
 */

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import type { InventoryEvidenceBundle } from "@/types/inventory-evidence";

interface EvidenceTabLeadTimeProps {
  evidence: InventoryEvidenceBundle;
}

/** Format 1 số ngày sang label hiển thị; 0 → "Trong ngày". */
function formatDaysLabel(days: number | null): string {
  if (days == null) return "—";
  if (days === 0) return "Trong ngày";
  const rounded = Number.isInteger(days) ? days : Math.round(days * 10) / 10;
  return `${rounded.toLocaleString("vi-VN")} ngày`;
}

/** Caption theo nguồn dữ liệu. */
function sourceCaption(source: string): string {
  if (source === "override") return "(theo khai báo)";
  return "(ước tính từ lịch sử)";
}

export function EvidenceTabLeadTime({ evidence }: EvidenceTabLeadTimeProps) {
  const lt = evidence.lead_time;
  const vendors = [...lt.per_vendor].sort((a, b) => b.sample - a.sample);

  const primaryDays = lt.override ?? lt.p50;
  const hasAnyData =
    lt.override != null || lt.sample > 0 || vendors.length > 0;

  if (!hasAnyData) {
    return <EmptyState primaryVendor={lt.primary_vendor_code} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Primary lead time + caption */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 text-sm">
            Thời gian giao hàng
            <HelpTooltip>
              Số ngày giao hàng dùng cho dự báo tồn kho. Nếu nhà cung cấp chính đã khai báo, dùng giá
              trị khai báo. Nếu không, tính từ lịch sử nhập hàng.
            </HelpTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <p className="text-3xl font-bold text-foreground">{formatDaysLabel(primaryDays)}</p>
            <p className="pb-1 text-sm text-muted-foreground">{sourceCaption(lt.source)}</p>
          </div>
          {lt.primary_vendor_code && (
            <p className="mt-1 text-xs text-muted-foreground">
              Nhà cung cấp chính: <span className="font-mono">{lt.primary_vendor_code}</span>
              <Link
                href={`/inventory/suppliers?q=${encodeURIComponent(lt.primary_vendor_code)}`}
                className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Pencil className="size-3" />
                {lt.override != null ? "Sửa khai báo" : "Khai báo"}
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Per-vendor history — only when we have samples */}
      {vendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lịch sử giao hàng theo nhà cung cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-4 border-b border-border pb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>Nhà cung cấp</span>
                <span className="text-right">Số lần</span>
                <span className="text-right">Trung bình</span>
                <span className="text-right">Chậm nhất (p90)</span>
              </div>
              {vendors.map((v) => (
                <div
                  key={v.vendor_code}
                  className="grid grid-cols-4 items-center border-b border-border/40 py-2.5 text-xs last:border-0"
                >
                  <span className="font-mono font-medium text-foreground">{v.vendor_code}</span>
                  <span className="text-right text-muted-foreground">{v.sample}</span>
                  <span className="text-right text-foreground">
                    {v.p50 != null ? Number(v.p50).toLocaleString("vi-VN") : "—"}
                  </span>
                  <span className="text-right text-muted-foreground">
                    {v.p90 != null ? Number(v.p90).toLocaleString("vi-VN") : "—"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EmptyState({ primaryVendor }: { primaryVendor: string | null }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">Chưa có dữ liệu thời gian giao hàng.</p>
        {primaryVendor && (
          <Link
            href={`/inventory/suppliers?q=${encodeURIComponent(primaryVendor)}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Khai báo cho nhà cung cấp {primaryVendor}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

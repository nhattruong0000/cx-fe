"use client";

/**
 * Lead Time Card — shows p50/p90 summary and top vendors ranked by sample count.
 * Uses Vietnamese labels for all technical terms.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import type { EvidenceLeadTimeProfile } from "@/types/inventory-evidence";

interface LeadTimeCardProps {
  leadTime: EvidenceLeadTimeProfile;
}

export function LeadTimeCard({ leadTime }: LeadTimeCardProps) {
  // Sort vendors by sample descending
  const vendors = [...leadTime.per_vendor].sort((a, b) => b.sample - a.sample);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          Thời gian giao hàng
          <HelpTooltip>
            Thời gian giao hàng trung bình (50% đơn) và chậm nhất thực tế (90% đơn) tính từ dữ liệu lịch sử nhập hàng.
          </HelpTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* p50/p90 summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Trung bình</p>
            <p className="mt-0.5 text-2xl font-bold text-foreground">
              {leadTime.p50 != null ? Number(leadTime.p50).toLocaleString("vi-VN") : "—"}
            </p>
            <p className="text-xs text-muted-foreground">ngày</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Chậm nhất thực tế</p>
            <p className="mt-0.5 text-2xl font-bold text-foreground">
              {leadTime.p90 != null ? Number(leadTime.p90).toLocaleString("vi-VN") : "—"}
            </p>
            <p className="text-xs text-muted-foreground">ngày</p>
          </div>
        </div>

        {/* Vendor list */}
        {vendors.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Top nhà cung cấp
            </p>
            <div className="flex flex-col gap-2">
              {vendors.map((v) => (
                <div key={v.vendor_code} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-foreground">{v.vendor_code}</span>
                    <span className="ml-1.5 text-muted-foreground">· {v.sample} lần giao</span>
                  </div>
                  <div className="text-right text-muted-foreground">
                    <span>
                      Trung bình {v.p50 != null ? Number(v.p50).toLocaleString("vi-VN") : "—"}
                    </span>
                    {v.p90 !== null && (
                      <span className="ml-1.5">
                        · chậm nhất {Number(v.p90).toLocaleString("vi-VN")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vendors.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Chưa có dữ liệu nhà cung cấp.
          </p>
        )}

        {/* Source note */}
        <p className="text-[10px] text-muted-foreground">
          Nguồn: {leadTime.source} · {leadTime.sample} đơn hàng
        </p>
      </CardContent>
    </Card>
  );
}

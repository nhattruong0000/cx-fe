"use client";

/**
 * Lead Time tab — p50/p90 summary, per-vendor table sorted by sample count,
 * and last 5 delivery events.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import type { InventoryEvidenceBundle } from "@/types/inventory-evidence";

interface EvidenceTabLeadTimeProps {
  evidence: InventoryEvidenceBundle;
}

export function EvidenceTabLeadTime({ evidence }: EvidenceTabLeadTimeProps) {
  const lt = evidence.lead_time;
  const vendors = [...lt.per_vendor].sort((a, b) => b.sample - a.sample);
  const events = lt.recent_events.slice(0, 5);

  const MATCH_METHOD_LABEL: Record<string, string> = {
    exact: "Khớp chính xác",
    fuzzy: "Khớp gần đúng",
    fallback: "Ước tính",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">
              Thời gian giao trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {lt.p50 != null ? Number(lt.p50).toLocaleString("vi-VN") : "—"}
            </p>
            <p className="text-xs text-muted-foreground">ngày</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Giao chậm nhất (90%)
              <HelpTooltip>
                90% các đơn hàng được giao trong thời gian này. Dùng để tính lượng dự trữ an toàn.
              </HelpTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {lt.p90 != null ? Number(lt.p90).toLocaleString("vi-VN") : "—"}
            </p>
            <p className="text-xs text-muted-foreground">ngày</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">Số đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{lt.sample}</p>
            <p className="text-xs text-muted-foreground">lần giao</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">Nguồn dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-foreground capitalize">{lt.source}</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-vendor table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Thời gian giao theo nhà cung cấp</CardTitle>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu theo nhà cung cấp.
            </p>
          ) : (
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-4 border-b border-border pb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>Nhà cung cấp</span>
                <span className="text-right">Trung bình (ngày)</span>
                <span className="text-right">Chậm nhất (ngày)</span>
                <span className="text-right">Số lần</span>
              </div>
              {vendors.map((v) => (
                <div
                  key={v.vendor_code}
                  className="grid grid-cols-4 items-center border-b border-border/40 py-2.5 text-xs last:border-0"
                >
                  <span className="font-medium text-foreground">{v.vendor_code}</span>
                  <span className="text-right text-foreground">
                    {v.p50 != null ? Number(v.p50).toLocaleString("vi-VN") : "—"}
                  </span>
                  <span className="text-right text-muted-foreground">
                    {v.p90 != null ? Number(v.p90).toLocaleString("vi-VN") : "—"}
                  </span>
                  <span className="text-right text-muted-foreground">{v.sample}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent events */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">5 lần giao hàng gần nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-4 border-b border-border pb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>Ngày nhận</span>
                <span>Nhà cung cấp</span>
                <span className="text-right">Số ngày giao</span>
                <span className="text-right">Phương pháp</span>
              </div>
              {events.map((e, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 items-center border-b border-border/40 py-2.5 text-xs last:border-0"
                >
                  <span className="text-foreground">
                    {new Date(e.receipt_date).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="text-muted-foreground">{e.vendor_code ?? "—"}</span>
                  <span className="text-right font-medium text-foreground">
                    {Number(e.lead_days).toLocaleString("vi-VN")}
                  </span>
                  <span className="text-right text-muted-foreground">
                    {MATCH_METHOD_LABEL[e.match_method] ?? e.match_method}
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

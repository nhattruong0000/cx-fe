"use client";

/**
 * Reliability tab — full reliability score panel with gauge, component breakdown,
 * and gate decision explanation.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReliabilityGauge } from "./reliability-gauge";
import type { InventoryEvidenceBundle } from "@/types/inventory-evidence";

interface EvidenceTabReliabilityProps {
  evidence: InventoryEvidenceBundle;
}

const GATE_EXPLANATION: Record<string, string> = {
  pass: "Dữ liệu đủ tin cậy để sử dụng dự báo đầy đủ với khoảng tin cậy. Kết quả có độ chính xác cao.",
  downgrade:
    "Dữ liệu có một số vấn đề nhỏ. Hệ thống dùng phương pháp dự báo thận trọng hơn với khoảng dao động rộng hơn.",
  drop: "Dữ liệu không đủ tin cậy để dự báo. Kết quả forecast không được hiển thị hoặc chỉ là ước tính thô.",
};

export function EvidenceTabReliability({ evidence }: EvidenceTabReliabilityProps) {
  const { reliability, lifecycle } = evidence;
  const gateDecision = reliability.gate_decision ?? "drop";
  const explanation = GATE_EXPLANATION[gateDecision] ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Gauge card */}
        <ReliabilityGauge reliability={reliability} />

        {/* Gate explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Giải thích kết quả đánh giá</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{explanation}</p>

            {/* Lifecycle info */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Vòng đời mặt hàng</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <span className="font-medium text-foreground capitalize">
                    {lifecycle.status ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Kiểu nhu cầu</span>
                  <span className="font-medium text-foreground capitalize">
                    {lifecycle.demand_pattern ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Số tuần có dữ liệu</span>
                  <span className="font-medium text-foreground">{lifecycle.active_weeks}</span>
                </div>
                {lifecycle.zero_ratio !== null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tỉ lệ tuần bán = 0</span>
                    <span className="font-medium text-foreground">
                      {Math.round((lifecycle.zero_ratio ?? 0) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How score is computed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cách tính điểm tin cậy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            Điểm tin cậy được tổng hợp từ 3 thành phần chính, mỗi thành phần kiểm tra một khía cạnh của chất lượng dữ liệu:
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Hệ thống AMIS:</strong> Kiểm tra kết nối và tính liên tục của đồng bộ dữ liệu tồn kho.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Liên kết mã hàng × nhà cung cấp:</strong> Xác minh mặt hàng có ít nhất một nhà cung cấp được liên kết với dữ liệu giao hàng.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Lịch sử bán theo tuần:</strong> Đánh giá số tuần có dữ liệu và tỉ lệ tuần bán được hàng.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

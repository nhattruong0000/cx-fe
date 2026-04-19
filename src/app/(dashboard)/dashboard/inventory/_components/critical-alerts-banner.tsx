"use client";

import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useAcknowledgeAlert,
  useInventoryAlerts,
} from "../_hooks/use-inventory-alerts";
import { alertTypeLabel, formatDate } from "./inventory-format-utils";

export function CriticalAlertsBanner() {
  const { data, isLoading, error } = useInventoryAlerts({
    severity: "critical",
    status: "open",
    per_page: 5,
  });

  const ack = useAcknowledgeAlert();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải cảnh báo nghiêm trọng…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
        Không tải được cảnh báo nghiêm trọng.
      </div>
    );
  }

  const alerts = data?.data ?? [];
  if (alerts.length === 0) return null;

  const handleAck = (id: string) => {
    ack.mutate(id, {
      onSuccess: () => toast.success("Đã xác nhận cảnh báo"),
      onError: () => toast.error("Không thể xác nhận cảnh báo"),
    });
  };

  return (
    <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4">
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[#DC2626]" />
        <h3 className="text-sm font-semibold text-[#991B1B]">
          {data!.meta.total} cảnh báo nghiêm trọng đang mở
        </h3>
        <Link
          href="/dashboard/inventory?severity=critical"
          className="ml-auto text-xs font-medium text-[#DC2626] underline-offset-2 hover:underline"
        >
          Xem tất cả
        </Link>
      </div>
      <ul className="space-y-1.5">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex items-start gap-2 rounded border border-[#FCA5A5] bg-white p-2 text-xs"
          >
            <div className="flex-1">
              <p className="font-medium text-[#991B1B]">
                {a.item_code} · {alertTypeLabel(a.alert_type)}
              </p>
              <p className="text-[#7F1D1D]">{a.message}</p>
              <p className="text-[10px] text-[#9F1239]">
                Phát hiện {formatDate(a.detected_at)}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={ack.isPending}
              onClick={() => handleAck(a.id)}
              className="h-7 px-2 text-xs"
            >
              Xác nhận
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

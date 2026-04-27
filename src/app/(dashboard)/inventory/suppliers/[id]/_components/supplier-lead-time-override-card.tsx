"use client";

import * as React from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { useUpdateSupplierLeadTime } from "@/hooks/use-update-supplier-lead-time";
import type { SupplierDetail } from "@/types/inventory";

interface Props {
  detail: SupplierDetail;
}

/**
 * Card cho phép khai báo/ghi đè lead time của nhà cung cấp.
 * - Hiển thị số ngày đã khai báo hoặc "Chưa khai báo".
 * - Input + save button chỉ hiện với user role admin (permission UX hint).
 *   Backend vẫn enforce permission `inventory:vendor_lead_time_manage` (403 nếu thiếu).
 */
export function SupplierLeadTimeOverrideCard({ detail }: Props) {
  const user = useAuthStore((s) => s.user);
  const canEdit = user?.role === "admin";

  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState<string>(
    detail.lead_time_override_days != null ? String(detail.lead_time_override_days) : ""
  );

  React.useEffect(() => {
    setValue(
      detail.lead_time_override_days != null ? String(detail.lead_time_override_days) : ""
    );
  }, [detail.lead_time_override_days]);

  const mutation = useUpdateSupplierLeadTime(detail.id);

  function handleSave() {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0 || n > 365) {
      toast.error("Nhập số ngày hợp lệ (1–365)");
      return;
    }
    mutation.mutate(n, {
      onSuccess: () => {
        toast.success("Đã cập nhật thời gian giao hàng");
        setEditing(false);
      },
      onError: (err) => {
        const isForbidden = /403|forbidden|authoriz/i.test(err.message ?? "");
        toast.error(
          isForbidden
            ? "Bạn không có quyền cập nhật thời gian giao hàng"
            : "Không lưu được. Thử lại."
        );
      },
    });
  }

  function handleCancel() {
    setValue(
      detail.lead_time_override_days != null ? String(detail.lead_time_override_days) : ""
    );
    setEditing(false);
  }

  const current = detail.lead_time_override_days;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Thời gian giao hàng khai báo</h3>
          <HelpTooltip>
            Số ngày giao hàng do bạn khai báo. Khi có, giá trị này ưu tiên hơn dữ liệu tính từ lịch sử
            và được dùng cho công thức dự báo (điểm đặt hàng, dự trữ an toàn).
          </HelpTooltip>
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={365}
              step={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-24 text-right"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              aria-label="Số ngày giao hàng"
            />
            <span className="text-sm text-muted-foreground">ngày</span>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={mutation.isPending}
              aria-label="Lưu"
            >
              <Check className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={mutation.isPending}
              aria-label="Hủy"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-foreground">
              {current != null ? `${current} ngày` : "Chưa khai báo"}
            </span>
            {canEdit && (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="size-3.5" />
                <span>{current != null ? "Sửa" : "Khai báo"}</span>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

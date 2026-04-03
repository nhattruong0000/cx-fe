"use client";

/** Pending invitations list for the organization members page */

import { XIcon, RotateCwIcon } from "lucide-react";
import { toast } from "sonner";
import { useOrgInvitations, useCancelOrgInvitation, useResendOrgInvitation } from "@/hooks/use-customer-organization";

export function PendingInvitationsTab() {
  const { data, isLoading } = useOrgInvitations();
  const { mutate: cancelInvitation } = useCancelOrgInvitation();
  const { mutate: resendInvitation } = useResendOrgInvitation();

  function handleResend(id: number, email: string) {
    resendInvitation(id, {
      onSuccess: () => toast.success(`Đã gửi lại lời mời đến ${email}`),
      onError: (err: unknown) => {
        const msg = (err as { message?: string })?.message ?? "Không thể gửi lại.";
        toast.error("Gửi lại thất bại", { description: msg });
      },
    });
  }

  function handleCancel(id: number, email: string) {
    cancelInvitation(id, {
      onSuccess: () => toast.success(`Đã hủy lời mời đến ${email}`),
      onError: (err: unknown) => {
        const msg = (err as { message?: string })?.message ?? "Không thể hủy lời mời.";
        toast.error("Hủy thất bại", { description: msg });
      },
    });
  }

  if (isLoading) {
    return <div className="py-10 text-center text-sm text-[#71717A]">Đang tải...</div>;
  }

  const invitations = data?.invitations ?? [];

  if (invitations.length === 0) {
    return <div className="py-10 text-center text-sm text-[#71717A]">Không có lời mời chờ nào</div>;
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E4E4E7]">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_60px] bg-[#F4F4F5] px-4 py-3">
        <span className="text-[13px] font-semibold text-[#3F3F46]">Email</span>
        <span className="text-[13px] font-semibold text-[#3F3F46]">Vai trò</span>
        <span className="text-[13px] font-semibold text-[#3F3F46]">Ngày mời</span>
        <span className="text-[13px] font-semibold text-[#3F3F46]">Trạng thái</span>
        <span />
      </div>

      {/* Rows */}
      {invitations.map((inv) => (
        <div
          key={inv.id}
          className="grid grid-cols-[2fr_1fr_1fr_1fr_60px] items-center border-b border-[#E4E4E7] px-4 py-3 last:border-b-0"
        >
          <span className="text-[13px] text-[#09090B] truncate">{inv.email}</span>

          {inv.org_role === "owner" ? (
            <span className="inline-flex w-fit rounded-full bg-[#EBF0FA] px-2.5 py-0.5 text-xs font-medium text-[#2556C5]">
              Chủ sở hữu
            </span>
          ) : (
            <span className="inline-flex w-fit rounded-full bg-[#F4F4F5] px-2.5 py-0.5 text-xs font-medium text-[#71717A]">
              Thành viên
            </span>
          )}

          <span className="text-[13px] text-[#71717A]">
            {new Date(inv.created_at).toLocaleDateString("vi-VN")}
          </span>

          <span className="inline-flex w-fit rounded-full bg-[#FEF9C3] px-2.5 py-0.5 text-xs font-medium text-[#A16207]">
            Chờ chấp nhận
          </span>

          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => handleResend(inv.id, inv.email)}
              className="rounded p-1 text-[#71717A] transition-colors hover:bg-[#F4F4F5] hover:text-[#2556C5]"
              aria-label="Gửi lại lời mời"
              title="Gửi lại"
            >
              <RotateCwIcon size={15} />
            </button>
            <button
              onClick={() => handleCancel(inv.id, inv.email)}
              className="rounded p-1 text-[#E81B22] transition-colors hover:bg-[#FEF2F2]"
              aria-label="Hủy lời mời"
              title="Hủy"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

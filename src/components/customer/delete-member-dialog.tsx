"use client";

/** Confirmation dialog for removing a member from the organization */

import { TriangleAlertIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { useRemoveOrgMember } from "@/hooks/use-customer-organization";
import type { OrgMember } from "@/types/customer-organization";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteMemberDialogProps {
  member: OrgMember | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteMemberDialog({ member, open, onClose }: DeleteMemberDialogProps) {
  const { mutate: removeMember, isPending } = useRemoveOrgMember();

  function handleDelete() {
    if (!member) return;

    removeMember(member.user_id, {
      onSuccess: () => {
        toast.success("Xóa thành viên thành công", {
          description: `${member.full_name} đã bị xóa khỏi tổ chức.`,
        });
        onClose();
      },
      onError: (error: unknown) => {
        // 422 = last owner — cannot remove
        const status = (error as { status?: number })?.status;
        if (status === 422) {
          toast.error("Không thể xóa thành viên", {
            description: "Tổ chức phải có ít nhất một chủ sở hữu.",
          });
        } else {
          toast.error("Xóa thất bại", {
            description: "Đã xảy ra lỗi. Vui lòng thử lại.",
          });
        }
      },
    });
  }

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-[14px] p-0 gap-0" showCloseButton={false}>
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-[#E4E4E7] gap-1">
          <DialogTitle className="text-base font-semibold text-[#E81B22]">
            Xóa thành viên
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#71717A]">
            Hành động này không thể hoàn tác
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="p-6">
          <div className="flex gap-3 rounded-[10px] bg-[#FEF2F2] p-4">
            <TriangleAlertIcon className="mt-0.5 size-5 shrink-0 text-[#E81B22]" />
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-medium text-[#09090B]">
                Bạn có chắc muốn xóa{" "}
                <span className="font-semibold">{member.full_name}</span>{" "}
                khỏi tổ chức?
              </p>
              <p className="text-[13px] text-[#71717A]">
                Thành viên sẽ mất tất cả quyền truy cập vào tổ chức.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-[#E4E4E7] bg-transparent flex-row justify-end gap-3 -mx-0 -mb-0 rounded-b-[14px]">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-[#E81B22] text-white hover:bg-[#E81B22]/90 shadow-none"
          >
            <Trash2Icon className="size-4" />
            {isPending ? "Đang xóa..." : "Xóa thành viên"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

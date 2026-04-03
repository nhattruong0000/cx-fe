"use client";

/** Dialog for editing an existing organization member's role and permissions */

import { useState, useEffect } from "react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";

import { useUpdateOrgMember } from "@/hooks/use-customer-organization";
import type { OrgMember } from "@/types/customer-organization";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CUSTOMER_PERMISSIONS } from "@/constants/customer-permissions";
import { getAvatarColor, getInitials } from "@/lib/utils/avatar-helpers";

const ROLE_OPTIONS = [
  { value: "member" as const, label: "Thành viên" },
  { value: "owner" as const, label: "Chủ sở hữu" },
];

interface EditMemberDialogProps {
  member: OrgMember | null;
  open: boolean;
  onClose: () => void;
}

export function EditMemberDialog({ member, open, onClose }: EditMemberDialogProps) {
  const [role, setRole] = useState<"owner" | "member">("member");
  const [permissions, setPermissions] = useState<string[]>([]);

  const { mutate: updateMember, isPending } = useUpdateOrgMember();

  // Sync form state when member changes
  useEffect(() => {
    if (member) {
      setRole(member.org_role);
      setPermissions([...member.permissions]);
    }
  }, [member]);

  function togglePermission(key: string) {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  function handleClose() {
    onClose();
  }

  function handleSubmit() {
    if (!member) return;

    updateMember(
      { userId: member.user_id, data: { org_role: role, permissions } },
      {
        onSuccess: () => {
          toast.success("Cập nhật thành công", {
            description: `Đã cập nhật thông tin của ${member.full_name}.`,
          });
          handleClose();
        },
        onError: (err: unknown) => {
          const msg = (err as { message?: string })?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.";
          toast.error("Cập nhật thất bại", { description: msg });
        },
      }
    );
  }

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[480px] rounded-[14px] p-0 gap-0" showCloseButton={false}>
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-[#E4E4E7] gap-1">
          <DialogTitle className="text-base font-semibold text-[#09090B]">
            Chỉnh sửa thành viên
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#71717A]">
            Cập nhật vai trò và quyền hạn của thành viên trong tổ chức.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col gap-5 p-6">
          {/* Member info card */}
          <div className="flex items-center gap-3 rounded-[10px] bg-[#F8FAFC] px-4 py-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ backgroundColor: getAvatarColor(member.full_name) }}
            >
              {getInitials(member.full_name)}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[#09090B]">{member.full_name}</span>
              <span className="text-[12px] text-[#71717A]">{member.email}</span>
            </div>
          </div>

          {/* Role selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#09090B]">Vai trò</label>
            <RadioGroup
              value={role}
              onValueChange={(v) => setRole(v as "owner" | "member")}
              className="grid grid-cols-2 gap-3"
            >
              {ROLE_OPTIONS.map(({ value, label }) => (
                <RadioPrimitive.Root
                  key={value}
                  value={value}
                  className={cn(
                    "group/radio-card flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border px-4 h-11 text-left transition-colors outline-none",
                    "border-[#E4E4E7] bg-white hover:bg-[#F8FAFC]",
                    "data-checked:border-2 data-checked:border-[#2556C5] data-checked:bg-[#EBF0FA]"
                  )}
                >
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-[#E4E4E7] transition-colors group-data-checked/radio-card:border-[3px] group-data-checked/radio-card:border-white group-data-checked/radio-card:bg-[#2556C5] group-data-checked/radio-card:shadow-[0_0_0_1px_#2556C5]">
                    <RadioPrimitive.Indicator>
                      <span className="block size-1.5 rounded-full bg-white" />
                    </RadioPrimitive.Indicator>
                  </span>
                  <span className="text-sm text-[#09090B] group-data-checked/radio-card:text-[#2556C5] group-data-checked/radio-card:font-medium">
                    {label}
                  </span>
                </RadioPrimitive.Root>
              ))}
            </RadioGroup>
          </div>

          {/* Permissions */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#09090B]">Quyền hạn</label>
            <div className="flex flex-col gap-2">
              {CUSTOMER_PERMISSIONS.map(({ key, label }) => {
                const checked = permissions.includes(key);
                return (
                  <label key={key} className="flex cursor-pointer items-center gap-2.5">
                    <span
                      onClick={() => togglePermission(key)}
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                        checked
                          ? "border-[#2556C5] bg-[#2556C5]"
                          : "border-[#E4E4E7] bg-white"
                      )}
                    >
                      {checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span
                      className="text-[13px] text-[#3F3F46]"
                      onClick={() => togglePermission(key)}
                    >
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-[#E4E4E7] bg-transparent flex-row justify-end gap-3 -mx-0 -mb-0 rounded-b-[14px]">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            <CheckIcon className="size-4" />
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

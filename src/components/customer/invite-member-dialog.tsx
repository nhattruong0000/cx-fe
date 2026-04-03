"use client";

/** Dialog for inviting a new member to the organization via email */

import { useState } from "react";
import { SendHorizonalIcon } from "lucide-react";
import { toast } from "sonner";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";

import { useInviteOrgMember } from "@/hooks/use-customer-organization";
import { CUSTOMER_PERMISSIONS } from "@/constants/customer-permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const ROLE_OPTIONS = [
  { value: "member" as const, label: "Thành viên" },
  { value: "owner" as const, label: "Chủ sở hữu" },
];

/** Default permissions for new members (excludes org:manage_members) */
const DEFAULT_MEMBER_PERMS = CUSTOMER_PERMISSIONS.map((p) => p.key);

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InviteMemberDialog({ open, onClose }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "member">("member");
  const [permissions, setPermissions] = useState<string[]>([...DEFAULT_MEMBER_PERMS]);
  const [emailError, setEmailError] = useState("");

  const { mutate: inviteMember, isPending } = useInviteOrgMember();

  function togglePermission(key: string) {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  function handleClose() {
    setEmail("");
    setRole("member");
    setPermissions([...DEFAULT_MEMBER_PERMS]);
    setEmailError("");
    onClose();
  }

  function handleSubmit() {
    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email không hợp lệ");
      return;
    }
    setEmailError("");

    inviteMember(
      { email: email.trim(), org_role: role, permissions },
      {
        onSuccess: () => {
          toast.success("Gửi lời mời thành công", {
            description: `Lời mời đã được gửi đến ${email}.`,
          });
          handleClose();
        },
        onError: (err: unknown) => {
          const msg = (err as { message?: string })?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.";
          toast.error("Gửi lời mời thất bại", { description: msg });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[480px] rounded-[14px] p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="px-6 py-5 border-b border-[#E4E4E7] gap-1">
          <DialogTitle className="text-base font-semibold text-[#09090B]">
            Mời thành viên
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#71717A]">
            Gửi lời mời tham gia tổ chức qua email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 p-6">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#09090B]">
              Địa chỉ email <span className="text-[#E81B22]">*</span>
            </label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              className={cn(emailError && "border-[#E81B22]")}
            />
            {emailError && <p className="text-[12px] text-[#E81B22]">{emailError}</p>}
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#09090B]">Vai trò trong tổ chức</label>
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
            <p className="text-[12px] text-[#71717A]">Chọn quyền cho thành viên được mời.</p>
            <div className="flex flex-col gap-2">
              {CUSTOMER_PERMISSIONS.map(({ key, label }) => {
                const checked = permissions.includes(key);
                return (
                  <label key={key} className="flex cursor-pointer items-center gap-2.5">
                    <span
                      onClick={() => togglePermission(key)}
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                        checked ? "border-[#2556C5] bg-[#2556C5]" : "border-[#E4E4E7] bg-white"
                      )}
                    >
                      {checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-[13px] text-[#3F3F46]" onClick={() => togglePermission(key)}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-[#E4E4E7] bg-transparent flex-row justify-end gap-3 -mx-0 -mb-0 rounded-b-[14px]">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            <SendHorizonalIcon className="size-4" />
            {isPending ? "Đang gửi..." : "Gửi lời mời"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

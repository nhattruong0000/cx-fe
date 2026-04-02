"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { InviteUserForm } from "@/components/admin/invite-user-form";

export default function InviteUserPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // Admin-only page guard
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (user && user.role !== "admin") return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Title row: icon + title */}
      <div className="flex items-center gap-3">
        <UserPlus className="size-6 text-[#2556C5]" />
        <h1 className="text-2xl font-semibold text-[#09090B]">Mời người dùng mới</h1>
      </div>
      {/* Subtitle */}
      <p className="text-sm text-[#71717A]">
        Gửi lời mời để thêm thành viên mới vào tổ chức của bạn.
      </p>

      <InviteUserForm />
    </div>
  );
}

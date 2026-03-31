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
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <UserPlus className="size-6 text-[#09090B]" />
        <div>
          <h1 className="text-xl font-semibold text-[#09090B]">Invite New User</h1>
          <p className="text-sm text-[#71717A]">
            Send an invitation email to add a new member to your organization.
          </p>
        </div>
      </div>

      <InviteUserForm />
    </div>
  );
}

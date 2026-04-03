"use client";

/** Main content for the "Tổ chức của tôi" (My Organization) page */

import Link from "next/link";
import { Crown, Users } from "lucide-react";
import { useMyOrganization } from "@/hooks/use-customer-organization";
import { OrgInfoCard } from "@/components/customer/org-info-card";
import { MyPermissionsCard } from "@/components/customer/my-permissions-card";

function RoleBadge({ role }: { role: "owner" | "member" }) {
  if (role === "owner") {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-[#EBF0FA] px-3.5 py-1">
        <Crown size={13} className="text-[#2556C5]" />
        <span className="text-[13px] font-semibold text-[#2556C5]">Chủ sở hữu</span>
      </div>
    );
  }

  return (
    <div className="rounded-full bg-[#F4F4F5] px-3.5 py-1">
      <span className="text-[13px] font-semibold text-[#71717A]">Thành viên</span>
    </div>
  );
}

export function MyOrganizationContent() {
  const { data, isLoading, isError, error } = useMyOrganization();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2556C5] border-t-transparent" />
      </div>
    );
  }

  if (isError || !data) {
    const message =
      error instanceof Error ? error.message : "Bạn chưa thuộc tổ chức nào.";

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-[#71717A]">{message}</p>
      </div>
    );
  }

  const { organization, membership } = data;
  const isOwner = membership.org_role === "owner";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#09090B]">Tổ chức của tôi</h1>
          <p className="text-sm text-[#71717A]">
            Thông tin tổ chức và quyền hạn của bạn trong hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RoleBadge role={membership.org_role} />
        </div>
      </div>

      {/* Owner: link to members management */}
      {isOwner && (
        <div>
          <Link
            href="/my-organization/members"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2556C5] hover:underline"
          >
            <Users size={15} />
            Quản lý thành viên →
          </Link>
        </div>
      )}

      {/* Info + permissions cards */}
      <div className="flex flex-col gap-6">
        <OrgInfoCard organization={organization} />
        <MyPermissionsCard permissions={membership.permissions} />
      </div>
    </div>
  );
}

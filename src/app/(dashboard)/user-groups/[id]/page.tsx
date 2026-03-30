"use client";

import { use } from "react";
import { PermissionGate } from "@/components/admin/permission-gate";
import { UserGroupDetailTabs } from "@/components/admin/user-group-detail-tabs";

export default function UserGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <PermissionGate>
      <UserGroupDetailTabs groupId={Number(id)} />
    </PermissionGate>
  );
}

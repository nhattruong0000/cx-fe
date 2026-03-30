"use client";

import { use } from "react";
import { PermissionGate } from "@/components/admin/permission-gate";
import { PermissionGroupDetailView } from "@/components/admin/permission-group-detail-view";

export default function PermissionGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <PermissionGate>
      <PermissionGroupDetailView groupId={Number(id)} />
    </PermissionGate>
  );
}

"use client";

import { PermissionGate } from "@/components/admin/permission-gate";
import { InviteUserForm } from "@/components/admin/invite-user-form";

export default function InviteUserPage() {
  return (
    <PermissionGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">Moi nguoi dung</h1>
          <p className="text-sm text-muted-foreground">
            Gui loi moi tham gia he thong qua email
          </p>
        </div>

        <div className="max-w-2xl">
          <InviteUserForm />
        </div>
      </div>
    </PermissionGate>
  );
}

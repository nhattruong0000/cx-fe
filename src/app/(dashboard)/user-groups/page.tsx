"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/admin/permission-gate";
import { UserGroupsList } from "@/components/admin/user-groups-list";

export default function UserGroupsPage() {
  return (
    <PermissionGate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Nhom nguoi dung</h1>
            <p className="text-sm text-muted-foreground">
              Quan ly nhom nguoi dung va phan quyen theo nhom
            </p>
          </div>
          <Button>
            <Plus className="mr-2 size-4" />
            Tao nhom
          </Button>
        </div>

        <UserGroupsList />
      </div>
    </PermissionGate>
  );
}

"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/admin/permission-gate";
import { PermissionGroupsList } from "@/components/admin/permission-groups-list";

export default function PermissionGroupsPage() {
  return (
    <PermissionGate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Nhom quyen</h1>
            <p className="text-sm text-muted-foreground">
              Quan ly nhom quyen va phan quyen trong he thong
            </p>
          </div>
          <Button>
            <Plus className="mr-2 size-4" />
            Tao nhom
          </Button>
        </div>

        <PermissionGroupsList />
      </div>
    </PermissionGate>
  );
}

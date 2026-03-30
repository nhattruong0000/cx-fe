"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/admin/permission-gate";
import { UsersDataTable } from "@/components/admin/users-data-table";

export default function UsersPage() {
  return (
    <PermissionGate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Quan ly nguoi dung</h1>
            <p className="text-sm text-muted-foreground">
              Quan ly tai khoan nguoi dung trong he thong
            </p>
          </div>
          <Link href="/users/invite">
            <Button>
              <UserPlus className="mr-2 size-4" />
              Moi nguoi dung
            </Button>
          </Link>
        </div>

        <UsersDataTable />
      </div>
    </PermissionGate>
  );
}

"use client";

import { PermissionGate } from "@/components/admin/permission-gate";
import { OrgsDataTable } from "@/components/admin/orgs-data-table";

export default function OrganizationsPage() {
  return (
    <PermissionGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">To chuc</h1>
          <p className="text-sm text-muted-foreground">
            Quan ly cac to chuc trong he thong
          </p>
        </div>

        <OrgsDataTable />
      </div>
    </PermissionGate>
  );
}

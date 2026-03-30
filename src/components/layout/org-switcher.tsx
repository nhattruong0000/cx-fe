"use client";

import { useAuthStore } from "@/stores/auth-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function OrgSwitcher() {
  const user = useAuthStore((s) => s.user);
  const activeOrgId = useAuthStore((s) => s.activeOrganizationId);
  const setActiveOrg = useAuthStore((s) => s.setActiveOrganization);

  const orgs = user?.organizations || [];

  if (orgs.length === 0) return null;

  if (orgs.length === 1) {
    return (
      <span className="text-sm font-medium text-muted-foreground">
        {orgs[0].organization_name}
      </span>
    );
  }

  return (
    <Select value={activeOrgId || undefined} onValueChange={(val) => { if (val) setActiveOrg(val); }}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Chọn tổ chức" />
      </SelectTrigger>
      <SelectContent>
        {orgs.map((org) => (
          <SelectItem key={org.organization_id} value={org.organization_id}>
            {org.organization_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

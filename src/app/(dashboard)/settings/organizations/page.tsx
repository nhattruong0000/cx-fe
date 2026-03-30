"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OrgsTable } from "@/components/admin/orgs-table";
import { OrgDetailPanel } from "@/components/admin/org-detail-panel";
import { useDebounce } from "@/hooks/use-debounce";
import type { Organization } from "@/types/admin";

export default function OrganizationsSettingsPage() {
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  if (selectedOrg) {
    return (
      <OrgDetailPanel
        orgId={selectedOrg.id}
        onBack={() => setSelectedOrg(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tổ chức..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <OrgsTable
        page={page}
        search={debouncedSearch || undefined}
        onSelectOrg={setSelectedOrg}
      />
    </div>
  );
}

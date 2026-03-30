"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizations } from "@/hooks/use-admin-orgs";
import type { Organization } from "@/types/admin";

interface OrganizationSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/** Multi-select organization picker with search */
export function OrganizationSelector({ selectedIds, onChange }: OrganizationSelectorProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useOrganizations({ q: search || undefined, per_page: 50 });

  const orgs: Organization[] = data?.data ?? [];
  const selectedOrgs = orgs.filter((o) => selectedIds.includes(o.id));

  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm">Chọn tổ chức</Label>

      {/* Selected badges */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedOrgs.map((org) => (
            <Badge key={org.id} variant="secondary" className="gap-1">
              {org.name}
              <button type="button" onClick={() => toggle(org.id)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search */}
      <Input
        placeholder="Tìm tổ chức..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List */}
      <div className="max-h-40 overflow-y-auto rounded border p-2 space-y-1">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        ) : orgs.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 text-center">
            Không tìm thấy tổ chức
          </p>
        ) : (
          orgs.map((org) => (
            <label key={org.id} className="flex items-center gap-2 text-sm cursor-pointer rounded px-1 py-0.5 hover:bg-accent">
              <Checkbox
                checked={selectedIds.includes(org.id)}
                onCheckedChange={() => toggle(org.id)}
              />
              <span>{org.name}</span>
              <span className="text-xs text-muted-foreground">({org.code})</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionCheckboxGrid } from "./permission-checkbox-grid";
import { useUpdateGroup } from "@/hooks/use-admin-groups";
import type { PermissionGroup } from "@/types/admin";

interface Props {
  group: PermissionGroup;
}

export function UserGroupPermissionsTab({ group }: Props) {
  const updateGroup = useUpdateGroup();
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    setPermissions([...group.permissions]);
  }, [group]);

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleCategory = (categoryPerms: readonly string[]) => {
    const allSelected = categoryPerms.every((p) => permissions.includes(p));
    if (allSelected) {
      setPermissions((prev) => prev.filter((p) => !categoryPerms.includes(p)));
    } else {
      setPermissions((prev) => [
        ...prev,
        ...categoryPerms.filter((p) => !prev.includes(p)),
      ]);
    }
  };

  const handleSave = async () => {
    try {
      await updateGroup.mutateAsync({ id: group.id, data: { permissions } });
      toast.success("Da cap nhat quyen");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cap nhat that bai");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quyen han</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PermissionCheckboxGrid
          permissions={permissions}
          onTogglePermission={togglePermission}
          onToggleCategory={toggleCategory}
        />

        <Button onClick={handleSave} disabled={updateGroup.isPending}>
          {updateGroup.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Dang luu...
            </>
          ) : (
            "Luu quyen"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

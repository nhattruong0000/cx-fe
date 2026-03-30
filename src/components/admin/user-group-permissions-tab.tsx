"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateGroup } from "@/hooks/use-admin-groups";
import { PERMISSION_CATEGORIES } from "@/types/admin";
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
        {Object.entries(PERMISSION_CATEGORIES).map(
          ([category, categoryPerms]) => {
            const allChecked = categoryPerms.every((p) =>
              permissions.includes(p)
            );
            const someChecked =
              !allChecked &&
              categoryPerms.some((p) => permissions.includes(p));

            return (
              <div key={category}>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onCheckedChange={() => toggleCategory(categoryPerms)}
                  />
                  <span className="font-medium text-sm">{category}</span>
                </label>
                <div className="ml-6 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryPerms.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={permissions.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {perm}
                      </span>
                    </label>
                  ))}
                </div>
                <Separator className="mt-3" />
              </div>
            );
          }
        )}

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

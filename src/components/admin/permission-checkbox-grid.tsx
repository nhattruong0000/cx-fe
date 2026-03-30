"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PERMISSION_CATEGORIES } from "@/types/admin";

interface PermissionCheckboxGridProps {
  permissions: string[];
  onTogglePermission: (perm: string) => void;
  onToggleCategory: (categoryPerms: readonly string[]) => void;
}

/**
 * Reusable checkbox grid for selecting permissions by category.
 * Used in both PermissionGroupDetailView and UserGroupPermissionsTab.
 */
export function PermissionCheckboxGrid({
  permissions,
  onTogglePermission,
  onToggleCategory,
}: PermissionCheckboxGridProps) {
  return (
    <>
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
                  onCheckedChange={() => onToggleCategory(categoryPerms)}
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
                      onCheckedChange={() => onTogglePermission(perm)}
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
    </>
  );
}

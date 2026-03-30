"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { usePermissionGroups, useUpdateGroup } from "@/hooks/use-admin-groups";
import { PERMISSION_CATEGORIES } from "@/types/admin";
import type { PermissionGroup, CreateGroupData } from "@/types/admin";

interface Props {
  groupId: number;
}

export function PermissionGroupDetailView({ groupId }: Props) {
  const router = useRouter();
  const { data: groups, isLoading } = usePermissionGroups();
  const updateGroup = useUpdateGroup();
  const group = groups?.find((g) => g.id === groupId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<PermissionGroup["scope"]>("staff");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
      setScope(group.scope);
      setPermissions([...group.permissions]);
    }
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
    const data: Partial<CreateGroupData> = {
      name,
      description,
      scope,
      permissions,
    };
    try {
      await updateGroup.mutateAsync({ id: groupId, data });
      toast.success("Da cap nhat nhom quyen");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cap nhat that bai");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Khong tim thay nhom quyen
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/permission-groups"
        className="inline-flex items-center text-sm text-primary hover:underline"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Quay lai
      </Link>

      {/* Group info */}
      <Card>
        <CardHeader>
          <CardTitle>Thong tin nhom</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Ten nhom</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Pham vi</Label>
              <Select
                value={scope}
                onValueChange={(v) =>
                  setScope(v as PermissionGroup["scope"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Mo ta</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissions grid */}
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
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={updateGroup.isPending}>
          {updateGroup.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Dang luu...
            </>
          ) : (
            "Luu thay doi"
          )}
        </Button>
        <Button variant="outline" onClick={() => router.push("/permission-groups")}>
          Huy
        </Button>
      </div>
    </div>
  );
}

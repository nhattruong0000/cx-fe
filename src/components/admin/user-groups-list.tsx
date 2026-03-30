"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MoreHorizontal, Trash2, Users } from "lucide-react";
import { usePermissionGroups, useDeleteGroup } from "@/hooks/use-admin-groups";
import { toast } from "sonner";
import type { PermissionGroup } from "@/types/admin";

/**
 * User Groups list — reuses permission groups API since user groups
 * are permission groups with scope filtering.
 * Groups displayed here have scope = 'staff' or 'both'.
 */
export function UserGroupsList() {
  const [search, setSearch] = useState("");
  const { data: groups, isLoading } = usePermissionGroups();
  const deleteGroup = useDeleteGroup();

  const userGroups = groups?.filter(
    (g) =>
      (g.scope === "staff" || g.scope === "both") &&
      g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (group: PermissionGroup) => {
    if (!confirm(`Xoa nhom "${group.name}"?`)) return;
    try {
      await deleteGroup.mutateAsync(group.id);
      toast.success("Da xoa nhom");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xoa that bai");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tim nhom nguoi dung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : !userGroups?.length ? (
        <p className="py-8 text-center text-muted-foreground">
          Khong tim thay nhom nao
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {userGroups.map((group) => (
            <Card key={group.id} size="sm">
              <CardContent className="flex items-start justify-between">
                <Link
                  href={`/user-groups/${group.id}`}
                  className="flex-1 space-y-1 hover:underline"
                >
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    <span className="font-medium">{group.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {group.description || "Khong co mo ta"}
                  </p>
                  <Badge variant="outline">
                    {group.member_count} thanh vien
                  </Badge>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon-xs" />}
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleDelete(group)}
                    >
                      <Trash2 className="size-4" />
                      Xoa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

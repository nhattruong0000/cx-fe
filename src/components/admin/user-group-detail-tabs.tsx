"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsPanel } from "@/components/ui/tabs";
import { usePermissionGroups } from "@/hooks/use-admin-groups";
import { UserGroupOverviewTab } from "./user-group-overview-tab";
import { UserGroupPermissionsTab } from "./user-group-permissions-tab";
import { UserGroupMembersTab } from "./user-group-members-tab";

interface Props {
  groupId: number;
}

export function UserGroupDetailTabs({ groupId }: Props) {
  const { data: groups, isLoading } = usePermissionGroups();
  const group = groups?.find((g) => g.id === groupId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Khong tim thay nhom nguoi dung
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/user-groups"
        className="inline-flex items-center text-sm text-primary hover:underline"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Quay lai
      </Link>

      <h1 className="text-xl font-bold">{group.name}</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tong quan</TabsTrigger>
          <TabsTrigger value="permissions">Quyen han</TabsTrigger>
          <TabsTrigger value="members">Thanh vien</TabsTrigger>
        </TabsList>

        <TabsPanel value="overview">
          <UserGroupOverviewTab group={group} />
        </TabsPanel>

        <TabsPanel value="permissions">
          <UserGroupPermissionsTab group={group} />
        </TabsPanel>

        <TabsPanel value="members">
          <UserGroupMembersTab group={group} />
        </TabsPanel>
      </Tabs>
    </div>
  );
}

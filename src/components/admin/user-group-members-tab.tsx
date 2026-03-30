"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { PermissionGroup } from "@/types/admin";

interface Props {
  group: PermissionGroup;
}

/**
 * Members tab for user group detail.
 * Shows member count summary. The API does not currently return
 * individual members for a group — only member_count is available.
 */
export function UserGroupMembersTab({ group }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Thành viên</span>
          <Badge variant="outline">{group.member_count} thành viên</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {group.member_count === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Users className="size-8 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Nhóm chưa có thành viên nào
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Users className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Nhóm này có {group.member_count} thành viên. Quản lý thành viên
              thông qua trang chi tiết người dùng.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

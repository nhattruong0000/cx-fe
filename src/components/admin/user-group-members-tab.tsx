"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PermissionGroup } from "@/types/admin";

interface Props {
  group: PermissionGroup;
}

/**
 * Members tab for user group detail.
 * Shows member count and placeholder — real member list requires
 * a dedicated API endpoint (group members by group ID).
 */
export function UserGroupMembersTab({ group }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Thanh vien</span>
          <Badge variant="outline">{group.member_count} thanh vien</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {group.member_count === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Nhom chua co thanh vien nao
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Nhom nay co {group.member_count} thanh vien. Quan ly thanh vien
              thong qua trang chi tiet nguoi dung.
            </p>
            {/* Placeholder list based on member_count */}
            <div className="space-y-2">
              {Array.from({ length: Math.min(group.member_count, 5) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>U{i + 1}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      Thanh vien #{i + 1}
                    </span>
                  </div>
                )
              )}
              {group.member_count > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  ... va {group.member_count - 5} thanh vien khac
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { MoreHorizontal, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PermissionGroup } from "@/types/admin";

const scopeLabels: Record<string, string> = {
  staff: "Staff",
  customer: "Customer",
  both: "Cả hai",
};

interface GroupCardProps {
  group: PermissionGroup;
  onEdit: (group: PermissionGroup) => void;
  onDelete: (group: PermissionGroup) => void;
}

export function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">{group.name}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {group.description}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md p-1.5 hover:bg-accent">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(group)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(group)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{group.member_count} thành viên</span>
          <Badge variant="outline" className="ml-auto">
            {scopeLabels[group.scope]}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1">
          {group.permissions.map((perm) => (
            <Badge key={perm} variant="secondary" className="text-xs">
              {perm}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

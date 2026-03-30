"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserX, UserCheck } from "lucide-react";
import type { AdminUser } from "@/types/admin";

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  staff: "secondary",
  customer: "outline",
};

const statusBadgeVariant: Record<string, "success" | "destructive" | "warning"> = {
  active: "success",
  suspended: "destructive",
  pending: "warning",
};

interface UsersRowActionsProps {
  user: AdminUser;
  onSuspend: (id: number) => void;
  onUnsuspend: (id: number) => void;
}

export function UsersRowActions({ user, onSuspend, onUnsuspend }: UsersRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.status === "active" ? (
          <DropdownMenuItem onClick={() => onSuspend(user.id)}>
            <UserX className="size-4" />
            Tam khoa
          </DropdownMenuItem>
        ) : user.status === "suspended" ? (
          <DropdownMenuItem onClick={() => onUnsuspend(user.id)}>
            <UserCheck className="size-4" />
            Mo khoa
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem>Chi tiet</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserNameCell({ user }: { user: AdminUser }) {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{user.full_name}</span>
    </div>
  );
}

export function UserRoleBadge({ role }: { role: string }) {
  return (
    <Badge variant={roleBadgeVariant[role] ?? "outline"}>
      {role}
    </Badge>
  );
}

export function UserStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusBadgeVariant[status] ?? "outline"}>
      {status === "active" ? "Hoat dong" : status === "suspended" ? "Bi khoa" : "Cho duyet"}
    </Badge>
  );
}

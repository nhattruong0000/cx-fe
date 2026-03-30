"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUsers, useSuspendUser, useUnsuspendUser } from "@/hooks/use-admin-users";
import type { AdminUser } from "@/types/admin";

const roleBadgeVariant: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
  admin: "destructive",
  staff: "default",
  customer: "secondary",
};

const statusBadgeVariant: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  active: "default",
  suspended: "destructive",
  pending: "outline",
};

interface UsersTableProps {
  page: number;
  role?: string;
  search?: string;
  onSelectUser: (user: AdminUser) => void;
}

export function UsersTable({ page, role, search, onSelectUser }: UsersTableProps) {
  const { data, isLoading } = useUsers({ page, role, q: search });
  const suspendMut = useSuspendUser();
  const unsuspendMut = useUnsuspendUser();
  const [confirmUser, setConfirmUser] = useState<AdminUser | null>(null);

  const handleSuspendToggle = async () => {
    if (!confirmUser) return;
    try {
      if (confirmUser.status === "suspended") {
        await unsuspendMut.mutateAsync(confirmUser.id);
        toast.success(`Đã mở khóa ${confirmUser.full_name}`);
      } else {
        await suspendMut.mutateAsync({ id: confirmUser.id });
        toast.success(`Đã tạm khóa ${confirmUser.full_name}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Thao tác thất bại");
    }
    setConfirmUser(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const users = data?.data || [];

  if (users.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        {search ? "Không tìm thấy người dùng phù hợp" : "Chưa có người dùng nào"}
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Nhóm</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initials = user.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const groupNames = user.groups.map((g) => g.name);
            const displayGroups =
              groupNames.length > 2
                ? `${groupNames.slice(0, 2).join(", ")} +${groupNames.length - 2}`
                : groupNames.join(", ");

            return (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => onSelectUser(user)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.full_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={roleBadgeVariant[user.role] || "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {displayGroups || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[user.status] || "outline"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="rounded-md p-1.5 hover:bg-accent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectUser(user); }}>
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); setConfirmUser(user); }}
                      >
                        {user.status === "suspended" ? "Mở khóa" : "Tạm khóa"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={!!confirmUser} onOpenChange={() => setConfirmUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmUser?.status === "suspended" ? "Mở khóa" : "Tạm khóa"} người dùng
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn {confirmUser?.status === "suspended" ? "mở khóa" : "tạm khóa"}{" "}
              {confirmUser?.full_name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmUser(null)}>
              Hủy
            </Button>
            <Button
              variant={confirmUser?.status === "suspended" ? "default" : "destructive"}
              onClick={handleSuspendToggle}
            >
              {confirmUser?.status === "suspended" ? "Mở khóa" : "Tạm khóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

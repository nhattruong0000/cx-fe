"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersTable } from "@/components/admin/users-table";
import { InviteUserDialog } from "@/components/admin/invite-user-dialog";
import { UserDetailDialog } from "@/components/admin/user-detail-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import type { AdminUser } from "@/types/admin";

export default function UsersSettingsPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v === "all" ? "" : v || "")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setInviteOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Mời
        </Button>
      </div>

      <UsersTable
        page={page}
        role={roleFilter || undefined}
        search={debouncedSearch || undefined}
        onSelectUser={setSelectedUser}
      />

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <UserDetailDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

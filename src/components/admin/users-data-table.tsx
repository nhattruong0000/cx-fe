"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsers, useSuspendUser, useUnsuspendUser } from "@/hooks/use-admin-users";
import {
  UserNameCell,
  UserRoleBadge,
  UserStatusBadge,
  UsersRowActions,
} from "./users-table-columns";
import { formatDate } from "@/lib/utils";

export function UsersDataTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers({ q: search || undefined, page });
  const suspendUser = useSuspendUser();
  const unsuspendUser = useUnsuspendUser();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tim kiem nguoi dung..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Nguoi dung</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Vai tro</th>
              <th className="px-4 py-3 text-left font-medium">Trang thai</th>
              <th className="px-4 py-3 text-left font-medium">Ngay tao</th>
              <th className="px-4 py-3 text-right font-medium w-12" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-5 w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !data?.data.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Khong tim thay nguoi dung nao
                </td>
              </tr>
            ) : (
              data.data.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <UserNameCell user={user} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <UsersRowActions
                      user={user}
                      onSuspend={(id) => suspendUser.mutate({ id })}
                      onUnsuspend={(id) => unsuspendUser.mutate(id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Trang {data.page} / {data.totalPages} ({data.total} nguoi dung)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Truoc
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

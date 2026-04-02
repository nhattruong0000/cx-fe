"use client"

import * as React from "react"
import type { ColumnDef, CellContext } from "@tanstack/react-table"
import { MoreHorizontalIcon, UserIcon, ShieldIcon, BanIcon } from "lucide-react"

import type { AdminUser } from "@/types/admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatRelativeTime } from "@/lib/format-relative-time"

// Role badge variant mapping
const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  staff: "secondary",
  customer: "outline",
}

// Role display labels (Vietnamese)
const ROLE_LABEL: Record<string, string> = {
  admin: "Quản trị viên",
  staff: "Nhân viên",
  customer: "Khách hàng",
}

// Status badge variant mapping (BE returns: active, suspended, pending)
const STATUS_VARIANT: Record<string, "success" | "destructive" | "warning"> = {
  active: "success",
  suspended: "destructive",
  pending: "warning",
}

// Status display labels (Vietnamese)
const STATUS_LABEL: Record<string, string> = {
  active: "Hoạt động",
  suspended: "Tạm khóa",
  pending: "Chờ duyệt",
}

/** Meta shape expected by action handlers */
export interface UserTableMeta {
  onViewProfile: (user: AdminUser) => void
  onEditRole: (user: AdminUser) => void
  onSuspend: (user: AdminUser) => void
}

/** Actions dropdown for a single user row */
function UserActionsDropdown({ user, meta }: { user: AdminUser; meta?: UserTableMeta }) {
  const isSuspended = user.status === "suspended"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="size-8 p-0 text-[#71717A] hover:text-[#09090B]">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => meta?.onViewProfile(user)}>
          <UserIcon className="size-4" />
          Xem hồ sơ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => meta?.onEditRole(user)}>
          <ShieldIcon className="size-4" />
          Sửa vai trò
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant={isSuspended ? undefined : "destructive"}
          onClick={() => meta?.onSuspend(user)}
        >
          <BanIcon className="size-4" />
          {isSuspended ? "Mở khóa" : "Tạm khóa"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "full_name",
    header: "Người dùng",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-[#09090B] truncate">{user.full_name}</span>
          <span className="text-xs text-[#71717A] truncate">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.original.role.toLowerCase()
      return (
        <Badge variant={ROLE_VARIANT[role] ?? "outline"}>
          {ROLE_LABEL[role] ?? row.original.role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase()
      return (
        <Badge variant={STATUS_VARIANT[status] ?? "outline"}>
          {STATUS_LABEL[status] ?? row.original.status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "groups",
    header: "Nhóm",
    cell: ({ row }) => {
      const groups = row.original.groups
      return (
        <span className="text-sm text-[#09090B]">
          {groups.length > 0 ? groups.map(g => g.name).join(", ") : "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tham gia",
    cell: ({ row }) => (
      <span className="text-sm text-[#71717A]">
        {formatRelativeTime(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row, table }: CellContext<AdminUser, unknown>) => (
      <UserActionsDropdown
        user={row.original}
        meta={table.options.meta as UserTableMeta | undefined}
      />
    ),
  },
]

"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon, UserIcon, ShieldIcon } from "lucide-react"

import type { AdminUser } from "@/types/admin"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatRelativeTime } from "@/lib/format-relative-time"
import { getInitials } from "@/lib/string-utils"

// Role badge variant mapping
const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  staff: "secondary",
  customer: "outline",
}

// Status badge variant mapping
const STATUS_VARIANT: Record<string, "success" | "destructive" | "warning"> = {
  active: "success",
  inactive: "destructive",
  pending: "warning",
}

/** Actions dropdown for a single user row */
function UserActionsDropdown({ user }: { user: AdminUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="size-8 p-0 text-[#71717A] hover:text-[#09090B]">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <UserIcon className="size-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShieldIcon className="size-4" />
          Edit Role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          Deactivate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "full_name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name} />}
            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-[#09090B] truncate">{user.full_name}</span>
            <span className="text-xs text-[#71717A] truncate">{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role.toLowerCase()
      return (
        <Badge variant={ROLE_VARIANT[role] ?? "outline"} className="capitalize">
          {row.original.role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase()
      return (
        <Badge variant={STATUS_VARIANT[status] ?? "outline"} className="capitalize">
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "groups",
    header: "Groups",
    cell: ({ row }) => {
      const groups = row.original.groups
      return (
        <span className="text-sm text-[#71717A]">
          {groups.length > 0 ? groups.join(", ") : "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "last_active",
    header: "Last Active",
    cell: ({ row }) => (
      <span className="text-sm text-[#71717A]">
        {formatRelativeTime(row.original.last_active)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <UserActionsDropdown user={row.original} />,
  },
]

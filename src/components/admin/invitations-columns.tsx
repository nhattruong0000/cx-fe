"use client"

import * as React from "react"
import type { ColumnDef, CellContext } from "@tanstack/react-table"
import { RefreshCwIcon, Trash2Icon } from "lucide-react"

import type { AdminInvitation } from "@/types/admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/format-relative-time"

// Status badge variant mapping — warning=pending, success=accepted, destructive=expired
const STATUS_VARIANT: Record<string, "warning" | "success" | "destructive"> = {
  pending: "warning",
  accepted: "success",
  expired: "destructive",
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Đang chờ",
  accepted: "Đã chấp nhận",
  expired: "Hết hạn",
}

const ROLE_LABEL: Record<string, string> = {
  admin: "Quản trị viên",
  staff: "Nhân viên",
  customer: "Khách hàng",
}

/** Meta shape expected by action handlers */
export interface InvitationTableMeta {
  onResend: (invitation: AdminInvitation) => void
  onDelete: (invitation: AdminInvitation) => void
}

/** Action buttons for a single invitation row */
function InvitationActions({
  invitation,
  meta,
}: {
  invitation: AdminInvitation
  meta?: InvitationTableMeta
}) {
  const canResend = invitation.status === "pending" || invitation.status === "expired"

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="size-8 p-0 text-[#71717A] hover:text-[#2556C5] disabled:opacity-40"
        disabled={!canResend}
        title="Gửi lại lời mời"
        onClick={() => meta?.onResend(invitation)}
      >
        <RefreshCwIcon className="size-4" />
        <span className="sr-only">Gửi lại</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="size-8 p-0 text-[#71717A] hover:text-destructive"
        title="Xóa lời mời"
        onClick={() => meta?.onDelete(invitation)}
      >
        <Trash2Icon className="size-4" />
        <span className="sr-only">Xóa</span>
      </Button>
    </div>
  )
}

export const invitationColumns: ColumnDef<AdminInvitation>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#09090B] truncate max-w-[220px] block">
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.original.role.toLowerCase()
      return (
        <span className="text-sm text-[#09090B]">
          {ROLE_LABEL[role] ?? row.original.role}
        </span>
      )
    },
  },
  {
    accessorKey: "invited_by",
    header: "Người mời",
    cell: ({ row }) => (
      <span className="text-sm text-[#71717A] truncate max-w-[180px] block">
        {row.original.invited_by}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={STATUS_VARIANT[status] ?? "outline"}>
          {STATUS_LABEL[status] ?? status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày mời",
    cell: ({ row }) => (
      <span className="text-sm text-[#71717A]">
        {formatRelativeTime(row.original.created_at)}
      </span>
    ),
  },
  {
    accessorKey: "expires_at",
    header: "Hết hạn",
    cell: ({ row }) => (
      <span className="text-sm text-[#71717A]">
        {formatRelativeTime(row.original.expires_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row, table }: CellContext<AdminInvitation, unknown>) => (
      <InvitationActions
        invitation={row.original}
        meta={table.options.meta as InvitationTableMeta | undefined}
      />
    ),
  },
]

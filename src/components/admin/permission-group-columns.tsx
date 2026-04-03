"use client"

import * as React from "react"
import type { ColumnDef, CellContext } from "@tanstack/react-table"
import { PencilIcon, TrashIcon } from "lucide-react"

import type { AdminGroup } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/format-relative-time"

export interface GroupTableMeta {
  onEdit: (group: AdminGroup) => void
  onDelete: (group: AdminGroup) => void
}

function GroupActionsCell({ row, table }: CellContext<AdminGroup, unknown>) {
  const meta = table.options.meta as GroupTableMeta | undefined
  const group = row.original

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="size-8 p-0 text-[#71717A] hover:text-[#09090B]"
        onClick={(e) => { e.stopPropagation(); meta?.onEdit(group) }}
        aria-label="Sửa nhóm"
      >
        <PencilIcon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="size-8 p-0 text-[#71717A] hover:text-destructive"
        onClick={(e) => { e.stopPropagation(); meta?.onDelete(group) }}
        aria-label="Xóa nhóm"
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  )
}

export const groupColumns: ColumnDef<AdminGroup>[] = [
  {
    accessorKey: "name",
    header: "Tên nhóm",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#09090B]">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="text-sm text-[#71717A] line-clamp-1">
        {row.original.description ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "member_count",
    header: "Thành viên",
    cell: ({ row }) => (
      <span className="text-sm text-[#09090B]">{row.original.member_count}</span>
    ),
  },
  {
    accessorKey: "permissions",
    header: "Quyền hạn",
    cell: ({ row }) => (
      <span className="text-sm text-[#09090B]">{row.original.permissions.length} quyền</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span className="text-sm text-[#71717A]">
        {formatRelativeTime(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: GroupActionsCell,
  },
]

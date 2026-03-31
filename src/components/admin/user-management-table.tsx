"use client"

import * as React from "react"

import type { AdminUser } from "@/types/admin"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { columns } from "@/components/admin/user-management-columns"

interface UserManagementTableProps {
  data: AdminUser[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function UserManagementTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
}: UserManagementTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <DataTable columns={columns} data={data} />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  )
}

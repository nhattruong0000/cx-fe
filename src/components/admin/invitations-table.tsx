"use client"

import * as React from "react"

import type { AdminInvitation } from "@/types/admin"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { invitationColumns } from "@/components/admin/invitations-columns"
import type { InvitationTableMeta } from "@/components/admin/invitations-columns"

interface InvitationsTableProps {
  data: AdminInvitation[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  meta?: InvitationTableMeta
}

export function InvitationsTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  meta,
}: InvitationsTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <DataTable columns={invitationColumns} data={data} meta={meta} />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        itemLabel="lời mời"
      />
    </div>
  )
}

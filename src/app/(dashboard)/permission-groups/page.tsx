"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { useAuthStore } from "@/stores/auth-store"
import { useAdminGroups } from "@/hooks/use-admin-users"
import { DataTable } from "@/components/ui/data-table"
import { DeleteGroupDialog } from "@/components/admin/delete-group-dialog"
import { groupColumns, type GroupTableMeta } from "@/components/admin/permission-group-columns"
import type { AdminGroup } from "@/types/admin"

export default function PermissionGroupsPage() {
  const router = useRouter()
  const authUser = useAuthStore((s) => s.user)

  // Admin-only guard
  React.useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [authUser, router])

  const { data, isLoading } = useAdminGroups()
  const groups = data?.groups ?? []

  const [deleteTarget, setDeleteTarget] = React.useState<AdminGroup | null>(null)

  const tableMeta: GroupTableMeta = React.useMemo(
    () => ({
      onEdit: (group) => router.push(`/permission-groups/${group.id}/edit`),
      onDelete: (group) => setDeleteTarget(group),
    }),
    [router]
  )

  if (authUser && authUser.role !== "admin") return null

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#09090B]">Nhóm quyền hạn</h1>
          <p className="mt-1 text-sm text-[#71717A]">
            Quản lý các nhóm quyền hạn và phân quyền cho nhân viên.
          </p>
        </div>
        <Link
          href="/permission-groups/create"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground whitespace-nowrap transition-all hover:bg-primary/90 shadow-[0_2px_4px_#2556C520,0_8px_20px_#2556C525]"
        >
          <PlusIcon className="size-4" />
          Tạo nhóm
        </Link>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-[#71717A]">
          Đang tải...
        </div>
      ) : (
        <DataTable
          columns={groupColumns}
          data={groups}
          meta={tableMeta}
        />
      )}

      {/* Delete confirmation dialog */}
      <DeleteGroupDialog
        group={deleteTarget}
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}

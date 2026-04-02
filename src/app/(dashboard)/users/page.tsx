"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { useRouter } from "next/navigation"
import { useAdminUsers } from "@/hooks/use-admin-users"
import { useAuthStore } from "@/stores/auth-store"
import { UserManagementToolbar } from "@/components/admin/user-management-toolbar"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { UserDetailDialog } from "@/components/admin/user-detail-dialog"
import { EditRoleDialog } from "@/components/admin/edit-role-dialog"
import { SuspendUserDialog } from "@/components/admin/suspend-user-dialog"
import type { AdminUser } from "@/types/admin"
import type { UserTableMeta } from "@/components/admin/user-management-columns"

const PAGE_SIZE = 5

export default function UsersPage() {
  const router = useRouter()
  const authUser = useAuthStore((s) => s.user)
  const [search, setSearch] = React.useState("")
  const [deferredSearch, setDeferredSearch] = React.useState("")
  const [role, setRole] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [page, setPage] = React.useState(1)

  // Admin-only page guard
  React.useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [authUser, router])

  // Debounce search input — reset page on new query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page when filters change — base-ui Select passes string | null
  const handleRoleChange = React.useCallback((value: string | null) => {
    setRole(value ?? "all")
    setPage(1)
  }, [])

  const handleStatusChange = React.useCallback((value: string | null) => {
    setStatus(value ?? "all")
    setPage(1)
  }, [])

  const params = {
    page,
    per_page: PAGE_SIZE,
    ...(deferredSearch ? { q: deferredSearch } : {}),
    ...(role !== "all" ? { role } : {}),
    ...(status !== "all" ? { status } : {}),
  }

  const { data, isLoading } = useAdminUsers(params)

  const users = data?.users ?? []
  const total = data?.total ?? 0

  // Dialog state for user actions
  const [dialogState, setDialogState] = React.useState<{
    type: "view" | "editRole" | "suspend" | null
    user: AdminUser | null
  }>({ type: null, user: null })

  const closeDialog = React.useCallback(() => setDialogState({ type: null, user: null }), [])

  const tableMeta: UserTableMeta = React.useMemo(() => ({
    onViewProfile: (user: AdminUser) => setDialogState({ type: "view", user }),
    onEditRole: (user: AdminUser) => setDialogState({ type: "editRole", user }),
    onSuspend: (user: AdminUser) => setDialogState({ type: "suspend", user }),
  }), [])

  // Don't render admin content for non-admin users
  if (authUser && authUser.role !== "admin") return null

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#09090B]">Quản lý người dùng</h1>
        </div>
        <Link
          href="/invite"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground whitespace-nowrap transition-all hover:bg-primary/90 shadow-[0_2px_4px_#2556C520,0_8px_20px_#2556C525]"
        >
          <PlusIcon className="size-4" />
          Mời người dùng
        </Link>
      </div>

      {/* Filters toolbar */}
      <UserManagementToolbar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={handleRoleChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {/* Data table + pagination */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-[#71717A]">
          Đang tải...
        </div>
      ) : (
        <UserManagementTable
          data={users}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          meta={tableMeta}
        />
      )}

      {/* Action dialogs */}
      <UserDetailDialog
        userId={dialogState.user?.id ?? null}
        open={dialogState.type === "view"}
        onClose={closeDialog}
      />
      <EditRoleDialog
        user={dialogState.type === "editRole" ? dialogState.user : null}
        open={dialogState.type === "editRole"}
        onClose={closeDialog}
      />
      <SuspendUserDialog
        user={dialogState.type === "suspend" ? dialogState.user : null}
        open={dialogState.type === "suspend"}
        onClose={closeDialog}
      />
    </div>
  )
}

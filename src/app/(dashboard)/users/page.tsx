"use client"

import * as React from "react"
import Link from "next/link"
import { UserPlusIcon } from "lucide-react"

import { useRouter } from "next/navigation"
import { useAdminUsers } from "@/hooks/use-admin-users"
import { useAuthStore } from "@/stores/auth-store"
import { UserManagementToolbar } from "@/components/admin/user-management-toolbar"
import { UserManagementTable } from "@/components/admin/user-management-table"

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
    page_size: PAGE_SIZE,
    ...(deferredSearch ? { search: deferredSearch } : {}),
    ...(role !== "all" ? { role } : {}),
    ...(status !== "all" ? { status } : {}),
  }

  const { data, isLoading } = useAdminUsers(params)

  const users = data?.users ?? []
  const total = data?.total ?? 0

  // Don't render admin content for non-admin users
  if (authUser && authUser.role !== "admin") return null

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#09090B]">User Management</h1>
          <p className="mt-1 text-sm text-[#71717A]">Manage users, roles, and permissions.</p>
        </div>
        <Link
          href="/invite"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground whitespace-nowrap transition-all hover:bg-primary/90"
        >
          <UserPlusIcon className="size-4" />
          Invite User
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
          Loading users...
        </div>
      ) : (
        <UserManagementTable
          data={users}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

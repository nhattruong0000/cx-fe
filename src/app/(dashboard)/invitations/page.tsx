"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { useAdminInvitations } from "@/hooks/use-admin-invitations"
import { useAuthStore } from "@/stores/auth-store"
import { InvitationsToolbar } from "@/components/admin/invitations-toolbar"
import { InvitationsTable } from "@/components/admin/invitations-table"
import { ResendInvitationDialog } from "@/components/admin/resend-invitation-dialog"
import { DeleteInvitationDialog } from "@/components/admin/delete-invitation-dialog"
import type { AdminInvitation } from "@/types/admin"
import type { InvitationTableMeta } from "@/components/admin/invitations-columns"

const PAGE_SIZE = 10

export default function InvitationsPage() {
  const router = useRouter()
  const authUser = useAuthStore((s) => s.user)

  const [search, setSearch] = React.useState("")
  const [deferredSearch, setDeferredSearch] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [page, setPage] = React.useState(1)

  // Admin-only page guard
  React.useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [authUser, router])

  // Debounce search — reset page on new query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleStatusChange = React.useCallback((value: string | null) => {
    setStatus(value ?? "all")
    setPage(1)
  }, [])

  const params = {
    page,
    per_page: PAGE_SIZE,
    ...(deferredSearch ? { q: deferredSearch } : {}),
    ...(status !== "all" ? { status } : {}),
  }

  const { data, isLoading } = useAdminInvitations(params)

  const invitations = data?.invitations ?? []
  const total = data?.total ?? 0

  // Dialog state for resend / delete actions
  const [dialogState, setDialogState] = React.useState<{
    type: "resend" | "delete" | null
    invitation: AdminInvitation | null
  }>({ type: null, invitation: null })

  const closeDialog = React.useCallback(
    () => setDialogState({ type: null, invitation: null }),
    []
  )

  const tableMeta: InvitationTableMeta = React.useMemo(
    () => ({
      onResend: (invitation: AdminInvitation) =>
        setDialogState({ type: "resend", invitation }),
      onDelete: (invitation: AdminInvitation) =>
        setDialogState({ type: "delete", invitation }),
    }),
    []
  )

  // Don't render admin content for non-admin users
  if (authUser && authUser.role !== "admin") return null

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#09090B]">Lời mời</h1>
          <p className="mt-0.5 text-sm text-[#71717A]">
            Quản lý các lời mời đã gửi đến người dùng
          </p>
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
      <InvitationsToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {/* Data table + pagination */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-[#71717A]">
          Đang tải...
        </div>
      ) : invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-sm font-medium text-[#09090B]">Không có lời mời nào</p>
          <p className="text-xs text-[#71717A]">
            Thử thay đổi bộ lọc hoặc mời người dùng mới
          </p>
        </div>
      ) : (
        <InvitationsTable
          data={invitations}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          meta={tableMeta}
        />
      )}

      {/* Action dialogs */}
      <ResendInvitationDialog
        invitation={dialogState.type === "resend" ? dialogState.invitation : null}
        open={dialogState.type === "resend"}
        onClose={closeDialog}
      />
      <DeleteInvitationDialog
        invitation={dialogState.type === "delete" ? dialogState.invitation : null}
        open={dialogState.type === "delete"}
        onClose={closeDialog}
      />
    </div>
  )
}

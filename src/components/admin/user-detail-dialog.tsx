"use client"

import * as React from "react"
import { useAdminUserDetail } from "@/hooks/use-admin-user-actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { formatRelativeTime } from "@/lib/format-relative-time"
import { getUserInitials } from "@/lib/user-initials"

interface UserDetailDialogProps {
  userId: string | null
  open: boolean
  onClose: () => void
}

export function UserDetailDialog({ userId, open, onClose }: UserDetailDialogProps) {
  const { data, isLoading } = useAdminUserDetail(open ? userId : null)
  const user = data?.user

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hồ sơ người dùng</DialogTitle>
          <DialogDescription>Thông tin chi tiết người dùng</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Đang tải...</p>
        ) : user ? (
          <div className="space-y-4">
            {/* Avatar section */}
            <div className="flex items-center gap-3">
              <Avatar size="md">
                <AvatarFallback>{getUserInitials(user.full_name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{user.full_name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            {/* Info rows */}
            <div className="grid gap-3 text-sm">
              <Row label="Vai trò">
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
              </Row>
              <Row label="Trạng thái">
                <Badge variant={user.suspended ? "destructive" : user.verified ? "success" : "warning"}>
                  {user.suspended ? "Tạm khóa" : user.verified ? "Hoạt động" : "Chờ duyệt"}
                </Badge>
              </Row>
              {user.suspension_reason && (
                <Row label="Lý do tạm khóa" value={user.suspension_reason} />
              )}
              <Row label="Nhóm" value={user.groups.length > 0 ? user.groups.map(g => g.name).join(", ") : "—"} />
              <Row label="Tổ chức" value={user.organizations.length > 0 ? user.organizations.map(o => `${o.name} (${o.org_role})`).join(", ") : "—"} />
              <Row label="Ngày tham gia" value={formatRelativeTime(user.created_at)} />
            </div>
          </div>
        ) : null}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 font-medium text-muted-foreground">{label}</span>
      {children ?? <span className="text-right">{value}</span>}
    </div>
  )
}

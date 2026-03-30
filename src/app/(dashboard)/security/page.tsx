"use client"

import { ChangePasswordForm } from "@/components/account/change-password-form"
import { ActiveSessionsTable } from "@/components/account/active-sessions-table"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LockIcon, MonitorIcon } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Bảo mật & Phiên đăng nhập</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý mật khẩu và các phiên đăng nhập của bạn
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Password change section */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <LockIcon className="size-4 text-muted-foreground" />
            <h2 className="text-base font-medium">Đổi mật khẩu</h2>
          </div>
          <ChangePasswordForm />
        </Card>

        <Separator />

        {/* Active sessions section */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MonitorIcon className="size-4 text-muted-foreground" />
            <h2 className="text-base font-medium">Phiên đăng nhập</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Danh sách các thiết bị đang đăng nhập vào tài khoản của bạn
          </p>
          <ActiveSessionsTable />
        </Card>
      </div>
    </div>
  )
}

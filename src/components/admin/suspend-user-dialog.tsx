"use client"

import * as React from "react"
import { toast } from "sonner"
import { useSuspendUser, useUnsuspendUser } from "@/hooks/use-admin-user-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface SuspendUserDialogProps {
  user: { id: string; full_name: string; status: string } | null
  open: boolean
  onClose: () => void
}

export function SuspendUserDialog({ user, open, onClose }: SuspendUserDialogProps) {
  const [reason, setReason] = React.useState("")
  const suspend = useSuspendUser()
  const unsuspend = useUnsuspendUser()

  const isSuspended = user?.status === "suspended"
  const isPending = suspend.isPending || unsuspend.isPending

  // Reset reason when dialog opens
  React.useEffect(() => {
    if (open) setReason("")
  }, [open])

  const handleSubmit = () => {
    if (!user) return

    if (isSuspended) {
      unsuspend.mutate(user.id, {
        onSuccess: () => { toast.success("Đã mở khóa người dùng"); onClose() },
        onError: (err: any) => toast.error(err?.message || "Mở khóa thất bại"),
      })
    } else {
      if (!reason.trim()) return
      suspend.mutate(
        { id: user.id, reason: reason.trim() },
        {
          onSuccess: () => { toast.success("Đã tạm khóa người dùng"); onClose() },
          onError: (err: any) => toast.error(err?.message || "Tạm khóa thất bại"),
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isSuspended ? "Mở khóa người dùng" : "Tạm khóa người dùng"}</DialogTitle>
          <DialogDescription>
            {isSuspended
              ? <>Kích hoạt lại <strong>{user?.full_name}</strong>?</>
              : <>Tạm khóa <strong>{user?.full_name}</strong> khỏi nền tảng.</>}
          </DialogDescription>
        </DialogHeader>

        {!isSuspended && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do tạm khóa..."
            rows={3}
            className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#09090B] placeholder:text-[#94A3B8] outline-none focus:border-[#2556C5] focus:ring-2 focus:ring-[#2556C5]/20"
          />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button
            variant={isSuspended ? "default" : "destructive"}
            onClick={handleSubmit}
            disabled={isPending || (!isSuspended && !reason.trim())}
          >
            {isPending ? "Đang xử lý..." : isSuspended ? "Mở khóa" : "Tạm khóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"

import { useResendInvitation } from "@/hooks/use-admin-invitations"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { AdminInvitation } from "@/types/admin"

interface ResendInvitationDialogProps {
  invitation: AdminInvitation | null
  open: boolean
  onClose: () => void
}

export function ResendInvitationDialog({
  invitation,
  open,
  onClose,
}: ResendInvitationDialogProps) {
  const resend = useResendInvitation()

  const handleResend = () => {
    if (!invitation) return

    resend.mutate(invitation.id, {
      onSuccess: () => {
        toast.success(`Đã gửi lại lời mời đến ${invitation.email}`)
        onClose()
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : "Gửi lại lời mời thất bại"
        toast.error(message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          {/* Primary icon */}
          <div className="mb-1 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <RefreshCwIcon className="size-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">Gửi lại lời mời</DialogTitle>
          <DialogDescription className="text-center">
            <span className="font-semibold text-[#09090B]">{invitation?.email}</span>
          </DialogDescription>
        </DialogHeader>

        <p className="text-center text-sm text-[#71717A]">
          Lời mời mới sẽ được gửi đến địa chỉ email này. Lời mời cũ sẽ không còn hiệu lực.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={resend.isPending}>
            Hủy
          </Button>
          <Button onClick={handleResend} disabled={resend.isPending}>
            <RefreshCwIcon className="size-4" />
            {resend.isPending ? "Đang gửi..." : "Gửi lại"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

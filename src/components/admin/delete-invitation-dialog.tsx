"use client"

import * as React from "react"
import { AlertTriangleIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { useDeleteInvitation } from "@/hooks/use-admin-invitations"
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

interface DeleteInvitationDialogProps {
  invitation: AdminInvitation | null
  open: boolean
  onClose: () => void
}

export function DeleteInvitationDialog({
  invitation,
  open,
  onClose,
}: DeleteInvitationDialogProps) {
  const deleteInvitation = useDeleteInvitation()

  const handleDelete = () => {
    if (!invitation) return

    deleteInvitation.mutate(invitation.id, {
      onSuccess: () => {
        toast.success(`Đã xóa lời mời của ${invitation.email}`)
        onClose()
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : "Xóa lời mời thất bại"
        toast.error(message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          {/* Destructive warning icon */}
          <div className="mb-1 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangleIcon className="size-6 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-center">Xóa lời mời</DialogTitle>
          <DialogDescription className="text-center">
            <span className="font-semibold text-[#09090B]">{invitation?.email}</span>
          </DialogDescription>
        </DialogHeader>

        <p className="text-center text-sm text-[#71717A]">
          Bạn có chắc chắn muốn xóa lời mời này? Hành động này không thể hoàn tác.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleteInvitation.isPending}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteInvitation.isPending}
          >
            <Trash2Icon className="size-4" />
            {deleteInvitation.isPending ? "Đang xóa..." : "Xóa lời mời"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

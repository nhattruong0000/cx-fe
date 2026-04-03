"use client"

import * as React from "react"
import { AlertTriangleIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { useDeleteGroup } from "@/hooks/use-admin-users"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { AdminGroup } from "@/types/admin"

interface DeleteGroupDialogProps {
  group: AdminGroup | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function DeleteGroupDialog({ group, open, onClose, onSuccess }: DeleteGroupDialogProps) {
  const deleteGroup = useDeleteGroup()

  const handleDelete = () => {
    if (!group) return

    deleteGroup.mutate(group.id, {
      onSuccess: () => {
        toast.success(`Đã xóa nhóm "${group.name}"`)
        onClose()
        onSuccess?.()
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : "Xóa nhóm thất bại"
        toast.error(message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          {/* Warning icon */}
          <div className="mb-1 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangleIcon className="size-6 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-center">Xóa nhóm quyền hạn</DialogTitle>
          <DialogDescription className="text-center">
            <span className="font-semibold text-[#09090B]">{group?.name}</span>
            <br />
            <span className="text-xs text-[#71717A]">
              {group?.member_count ?? 0} thành viên &middot; {group?.permissions.length ?? 0} quyền hạn
            </span>
          </DialogDescription>
        </DialogHeader>

        <p className="text-center text-sm text-[#71717A]">
          Bạn có chắc chắn muốn xóa nhóm quyền hạn này? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến tất cả thành viên trong nhóm.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleteGroup.isPending}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteGroup.isPending}
          >
            <TrashIcon className="size-4" />
            {deleteGroup.isPending ? "Đang xóa..." : "Xóa nhóm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

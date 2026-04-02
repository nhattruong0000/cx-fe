"use client"

import * as React from "react"
import { toast } from "sonner"
import { useAssignRole } from "@/hooks/use-admin-user-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditRoleDialogProps {
  user: { id: string; full_name: string; role: string } | null
  open: boolean
  onClose: () => void
}

const ROLES = [
  { value: "admin", label: "Quản trị viên" },
  { value: "staff", label: "Nhân viên" },
  { value: "customer", label: "Khách hàng" },
] as const

export function EditRoleDialog({ user, open, onClose }: EditRoleDialogProps) {
  const [role, setRole] = React.useState("")
  const assignRole = useAssignRole()

  // Sync initial role when dialog opens
  React.useEffect(() => {
    if (user && open) setRole(user.role)
  }, [user, open])

  const handleSubmit = () => {
    if (!user || !role || role === user.role) return
    assignRole.mutate(
      { id: user.id, role },
      {
        onSuccess: () => {
          toast.success(`Đã cập nhật vai trò thành ${role}`)
          onClose()
        },
        onError: (err: any) => toast.error(err?.message || "Cập nhật vai trò thất bại"),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sửa vai trò</DialogTitle>
          <DialogDescription>
            Thay đổi vai trò cho <strong>{user?.full_name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Vai trò</Label>
          <Select value={role} onValueChange={(v) => v && setRole(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            disabled={assignRole.isPending || !role || role === user?.role}
          >
            {assignRole.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

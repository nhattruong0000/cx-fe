"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"
import { useUpdateUserInfo } from "@/hooks/use-admin-user-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const schema = z.object({
  full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
})

type FormValues = z.infer<typeof schema>

interface EditUserInfoDialogProps {
  user: { id: string; full_name: string; email: string } | null
  open: boolean
  onClose: () => void
}

export function EditUserInfoDialog({ user, open, onClose }: EditUserInfoDialogProps) {
  const updateUserInfo = useUpdateUserInfo(user?.id ?? "")

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "" },
  })

  const watchedEmail = form.watch("email")
  const emailChanged = watchedEmail !== (user?.email ?? "")

  // Sync form values when dialog opens
  React.useEffect(() => {
    if (user && open) {
      form.reset({ full_name: user.full_name, email: user.email })
    }
  }, [user, open, form])

  const isUnchanged =
    form.watch("full_name") === user?.full_name &&
    form.watch("email") === user?.email

  const handleSubmit = (values: FormValues) => {
    if (!user) return
    updateUserInfo.mutate(values, {
      onSuccess: () => {
        toast.success("Đã cập nhật thông tin người dùng")
        onClose()
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : "Cập nhật thất bại"
        toast.error(message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sửa thông tin</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin cho <strong>{user?.full_name}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Warning when email is changed */}
            {emailChanged && (
              <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Người dùng cần xác minh email mới sau khi thay đổi</span>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateUserInfo.isPending || isUnchanged}
              >
                {updateUserInfo.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

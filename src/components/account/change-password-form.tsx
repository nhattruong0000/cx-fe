"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { accountApi } from "@/lib/api/account"

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    new_password: z.string().min(8, "Mật khẩu mới tối thiểu 8 ký tự"),
    confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

export function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  async function onSubmit(data: PasswordFormData) {
    try {
      await accountApi.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.confirm_password,
      })
      reset()
      toast.success("Đổi mật khẩu thành công")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Đổi mật khẩu thất bại"
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current_password">Mật khẩu hiện tại</Label>
        <div className="relative">
          <Input
            id="current_password"
            type={showCurrent ? "text" : "password"}
            {...register("current_password")}
          />
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowCurrent(!showCurrent)}
            tabIndex={-1}
          >
            {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.current_password && (
          <p className="text-sm text-destructive">{errors.current_password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new_password">Mật khẩu mới</Label>
        <div className="relative">
          <Input
            id="new_password"
            type={showNew ? "text" : "password"}
            {...register("new_password")}
          />
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowNew(!showNew)}
            tabIndex={-1}
          >
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.new_password && (
          <p className="text-sm text-destructive">{errors.new_password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Xác nhận mật khẩu mới</Label>
        <Input
          id="confirm_password"
          type="password"
          {...register("confirm_password")}
        />
        {errors.confirm_password && (
          <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
        Cập nhật mật khẩu
      </Button>
    </form>
  )
}

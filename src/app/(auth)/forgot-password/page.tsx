"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Info, KeyRound, Loader2 } from "lucide-react"

import { AuthLeftPanel } from "@/components/auth/auth-left-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as authApi from "@/lib/api/auth"

const forgotSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  })

  async function onSubmit(data: ForgotFormValues) {
    try {
      await authApi.forgotPassword(data.email)
      setSent(true)
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại."
      setError("root", { message })
    }
  }

  return (
    <>
      <AuthLeftPanel
        headline="Đặt lại mật khẩu"
        description="Bảo mật tài khoản là ưu tiên hàng đầu. Chúng tôi sẽ giúp bạn truy cập lại an toàn."
        centerIcon={
          <div className="flex size-[120px] items-center justify-center rounded-full bg-white/15">
            <KeyRound className="size-12" />
          </div>
        }
      />

      <div className="flex flex-1 items-center justify-center p-6 sm:px-20 sm:py-12">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Back link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Quay lại đăng nhập
          </Link>

          {/* Header */}
          <div>
            <h2 className="text-[30px] font-bold leading-tight tracking-tight">
              Quên mật khẩu?
            </h2>
            <p className="mt-1.5 text-[15px] leading-normal text-muted-foreground">
              Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại.
            </p>
          </div>

          {sent ? (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
              Kiểm tra email của bạn để nhận liên kết đặt lại mật khẩu.
              Nếu không thấy, hãy kiểm tra thư mục spam.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {errors.root.message}
                </p>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Địa chỉ email</Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full shadow-[0_2px_4px_rgba(37,86,197,0.12),0_8px_20px_rgba(37,86,197,0.15)]"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Gửi liên kết đặt lại
              </Button>
            </form>
          )}

          {/* Info box */}
          <div className="flex gap-2.5 rounded-[10px] bg-[#EFF6FF] px-4 py-3">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Không tìm thấy email? Kiểm tra thư mục spam hoặc thử địa
              chỉ email khác.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  ClipboardList,
  Globe,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react"

import { AuthLeftPanel } from "@/components/auth/auth-left-panel"
import { PasswordInputWithToggle } from "@/components/auth/password-input-with-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import * as authApi from "@/lib/api/auth"
import { useAuthStore } from "@/stores/auth-store"

const loginSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LEFT_PANEL_FEATURES = [
  "Quản lý khảo sát",
  "Phân tích khách hàng",
  "Cộng tác nhóm",
]

const LEFT_PANEL_ICONS = [
  <ClipboardList key="survey" className="size-5 text-white/90" />,
  <BarChart3 key="analytics" className="size-5 text-white/90" />,
  <Users key="collab" className="size-5 text-white/90" />,
]

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setTokens } = useAuthStore()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    try {
      const res = await authApi.login(data.email, data.password)
      setUser(res.user)
      setTokens(res.tokens)
      router.push("/dashboard")
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        "Thông tin đăng nhập không đúng. Vui lòng thử lại."
      setError("root", { message })
    }
  }

  return (
    <>
      <AuthLeftPanel
        headline="Chào mừng trở lại"
        description="Quản lý trải nghiệm khách hàng với phân tích mạnh mẽ và cộng tác liền mạch."
        features={LEFT_PANEL_FEATURES}
        featureIcons={LEFT_PANEL_ICONS}
      />

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Đăng nhập vào tài khoản
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Nhập thông tin đăng nhập để truy cập hệ thống
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <p className="text-sm font-medium text-destructive">
                {errors.root.message}
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Địa chỉ email</Label>
              <Input
                id="email"
                placeholder="name@company.com"
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <PasswordInputWithToggle
                id="password"
                placeholder="Nhập mật khẩu của bạn"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full shadow-[0_2px_4px_rgba(37,86,197,0.12),0_8px_20px_rgba(37,86,197,0.15)]"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Đăng nhập
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-[13px] text-muted-foreground">hoặc</span>
            <Separator className="flex-1" />
          </div>

          {/* Social buttons (UI only) */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" disabled>
              <Globe className="size-4" />
              Google
            </Button>
            <Button variant="outline" type="button" disabled>
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            <span>Được bảo vệ bởi SonNguyen CX</span>
          </div>
        </div>
      </div>
    </>
  )
}

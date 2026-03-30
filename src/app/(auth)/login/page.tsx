"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ShieldCheck } from "lucide-react"

import { AuthLeftPanel } from "@/components/auth/auth-left-panel"
import { PasswordInputWithToggle } from "@/components/auth/password-input-with-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import * as authApi from "@/lib/api/auth"
import { useAuthStore } from "@/stores/auth-store"

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LEFT_PANEL_FEATURES = [
  "Unified customer communication platform",
  "Real-time analytics and reporting",
  "Seamless team collaboration tools",
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
      router.push("/")
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        "Invalid credentials. Please try again."
      setError("root", { message })
    }
  }

  return (
    <>
      <AuthLeftPanel
        headline="Welcome back"
        description="Manage your customer experience with powerful tools designed for modern teams."
        features={LEFT_PANEL_FEATURES}
      />

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your credentials to access your workspace
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
              <Label htmlFor="email">Email address</Label>
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
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInputWithToggle
                id="password"
                placeholder="Enter your password"
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          {/* Social buttons (UI only) */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" disabled>
              Google
            </Button>
            <Button variant="outline" type="button" disabled>
              Facebook
            </Button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            <span>Protected by SonNguyen CX</span>
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Info, KeyRound, Loader2 } from "lucide-react"

import { AuthLeftPanel } from "@/components/auth/auth-left-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as authApi from "@/lib/api/auth"

const forgotSchema = z.object({
  email: z.email("Invalid email address"),
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
        "Something went wrong. Please try again."
      setError("root", { message })
    }
  }

  return (
    <>
      <AuthLeftPanel
        headline="Reset your password"
        description="Your account security is our top priority. We'll help you regain access safely."
        centerIcon={
          <div className="flex size-[120px] items-center justify-center rounded-full bg-white/15">
            <KeyRound className="size-12" />
          </div>
        }
      />

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Back link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>

          {/* Header */}
          <div>
            <h2 className="text-[30px] font-bold leading-tight tracking-tight">
              Forgot password?
            </h2>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          {sent ? (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
              Check your email for a password reset link. If you don&apos;t see
              it, check your spam folder.
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
                <Label htmlFor="email">Email address</Label>
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
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Send Reset Link
              </Button>
            </form>
          )}

          {/* Info box */}
          <div className="flex gap-2.5 rounded-lg bg-[#EFF6FF] p-3.5">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              If an account exists with this email, you&apos;ll receive a
              password reset link within a few minutes.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

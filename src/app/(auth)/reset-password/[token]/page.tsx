"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { KeyRound, ShieldAlert } from "lucide-react"
import Link from "next/link"

import { AuthLeftPanel } from "@/components/auth/auth-left-panel"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { validateResetToken } from "@/lib/api/auth"
import { ResetPasswordForm } from "./reset-password-form"

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>()
  const [loading, setLoading] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)

  useEffect(() => {
    async function validate() {
      try {
        const res = await validateResetToken(params.token)
        if (res.valid) {
          setTokenValid(true)
        } else {
          setTokenError("This reset link is invalid or has expired.")
        }
      } catch {
        setTokenError("This reset link is invalid or has expired.")
      } finally {
        setLoading(false)
      }
    }
    validate()
  }, [params.token])

  const rightContent = loading ? (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  ) : tokenError || !tokenValid ? (
    <div className="mx-auto flex max-w-[420px] flex-col items-center gap-4 text-center">
      <ShieldAlert className="size-12 text-destructive" />
      <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
      <p className="text-sm text-muted-foreground">
        {tokenError ?? "This reset link is invalid or has expired."}
      </p>
      <Link href="/forgot-password">
        <Button variant="outline">Request New Link</Button>
      </Link>
    </div>
  ) : (
    <div className="mx-auto flex w-full max-w-[420px] flex-col">
      <ResetPasswordForm token={params.token} />
    </div>
  )

  return (
    <>
      <AuthLeftPanel
        headline="Reset your password"
        description="Your account security is our top priority. We'll help you regain access safely."
        centerIcon={
          <div className="flex size-[120px] items-center justify-center rounded-full bg-white/[0.15]">
            <KeyRound className="size-12" />
          </div>
        }
      />
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        {rightContent}
      </div>
    </>
  )
}

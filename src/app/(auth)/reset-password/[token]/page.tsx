"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ShieldAlert, ShieldCheck } from "lucide-react"
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
          setTokenError("Liên kết đặt lại không hợp lệ hoặc đã hết hạn.")
        }
      } catch {
        setTokenError("Liên kết đặt lại không hợp lệ hoặc đã hết hạn.")
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
      <h2 className="text-2xl font-bold">Liên kết đặt lại không hợp lệ</h2>
      <p className="text-sm text-muted-foreground">
        {tokenError ?? "Liên kết đặt lại không hợp lệ hoặc đã hết hạn."}
      </p>
      <Link href="/forgot-password">
        <Button variant="outline">Yêu cầu liên kết mới</Button>
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
        headline="Bảo mật tài khoản của bạn"
        description="Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn. Bảo mật của bạn là ưu tiên hàng đầu của chúng tôi."
        centerIcon={
          <div className="flex size-[120px] items-center justify-center rounded-full bg-white/[0.15]">
            <ShieldCheck className="size-14" />
          </div>
        }
      />
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        {rightContent}
      </div>
    </>
  )
}

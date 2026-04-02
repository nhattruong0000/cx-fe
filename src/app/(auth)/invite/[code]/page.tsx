"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BarChart3, Mail, ShieldCheck, Users, UserPlus } from "lucide-react"
import Link from "next/link"

import { AuthLeftPanel } from "@/components/auth/auth-left-panel"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { validateInvitation } from "@/lib/api/auth"
import type { InvitationDetails } from "@/types/auth"

import { InviteInfoCard } from "./invite-info-card"
import { InviteAcceptForm } from "./invite-accept-form"

const INVITE_FEATURES = [
  "Bảo mật & phân quyền cấp doanh nghiệp",
  "Phân tích thời gian thực & thông tin khảo sát",
  "Công cụ cộng tác nhóm liền mạch",
]

const INVITE_FEATURE_ICONS = [
  <ShieldCheck key="shield" className="size-5 text-white/90" />,
  <BarChart3 key="chart" className="size-5 text-white/90" />,
  <Users key="users" className="size-5 text-white/90" />,
]

export default function InviteAcceptPage() {
  const params = useParams<{ code: string }>()
  const [invite, setInvite] = useState<InvitationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInvite() {
      try {
        const data = await validateInvitation(params.code)
        setInvite(data)
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Liên kết lời mời không hợp lệ hoặc đã hết hạn."
        setLoadError(message)
      } finally {
        setLoading(false)
      }
    }
    fetchInvite()
  }, [params.code])

  const rightContent = loading ? (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  ) : loadError || !invite ? (
    <div className="mx-auto flex max-w-[420px] flex-col items-center gap-4 text-center">
      <Mail className="size-12 text-destructive" />
      <h2 className="text-2xl font-bold">Lời mời không hợp lệ</h2>
      <p className="text-sm text-muted-foreground">
        {loadError ?? "Liên kết lời mời không hợp lệ hoặc đã hết hạn."}
      </p>
      <Link href="/login">
        <Button variant="outline">Đi đến đăng nhập</Button>
      </Link>
    </div>
  ) : (
    <div className="mx-auto flex w-full max-w-[420px] flex-col gap-6">
      <div className="flex w-fit items-center gap-2 rounded-full bg-[#EBF0FA] px-3.5 py-1.5 text-[13px] font-semibold text-primary">
        <Mail className="size-4" />
        Bạn đã được mời
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">
          Tạo tài khoản
        </h1>
        <p className="text-sm text-muted-foreground">
          Hoàn tất hồ sơ để tham gia nhóm
        </p>
      </div>

      <InviteInfoCard invite={invite} />
      <InviteAcceptForm code={params.code} invite={invite} />

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  )

  return (
    <>
      <AuthLeftPanel
        headline="Tham gia nhóm của bạn"
        description="Bạn đã được mời cộng tác trên nền tảng SonNguyen CX. Thiết lập tài khoản để bắt đầu."
        features={INVITE_FEATURES}
        featureIcons={INVITE_FEATURE_ICONS}
        centerIcon={<UserPlus className="size-14 text-white/40" />}
      />
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10">
        {rightContent}
      </div>
    </>
  )
}

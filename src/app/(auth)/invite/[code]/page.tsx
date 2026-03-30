"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Mail, UserPlus } from "lucide-react"
import Link from "next/link"

import { AuthLeftPanel } from "@/components/auth/auth-left-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { validateInvitation } from "@/lib/api/auth"
import type { InvitationDetails } from "@/types/auth"

import { InviteInfoCard } from "./invite-info-card"
import { InviteAcceptForm } from "./invite-accept-form"

const INVITE_FEATURES = [
  "Collaborate with your team in real-time",
  "Access shared dashboards and analytics",
  "Manage customer interactions together",
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
            : "Invalid or expired invitation link."
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
      <h2 className="text-2xl font-bold">Invalid Invitation</h2>
      <p className="text-sm text-muted-foreground">
        {loadError ?? "Invalid or expired invitation link."}
      </p>
      <Link href="/login">
        <Button variant="outline">Go to Login</Button>
      </Link>
    </div>
  ) : (
    <div className="mx-auto flex w-full max-w-[420px] flex-col gap-6">
      <Badge variant="success" className="w-fit">
        <Mail className="size-3.5" />
        You&apos;ve been invited
      </Badge>

      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold leading-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete your profile to join the team
        </p>
      </div>

      <InviteInfoCard invite={invite} />
      <InviteAcceptForm code={params.code} invite={invite} />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )

  return (
    <>
      <AuthLeftPanel
        headline="Join your team"
        description="You've been invited to collaborate on SonNguyen CX. Create your account to get started."
        features={INVITE_FEATURES}
        centerIcon={<UserPlus className="size-14 text-white/40" />}
      />
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10">
        {rightContent}
      </div>
    </>
  )
}

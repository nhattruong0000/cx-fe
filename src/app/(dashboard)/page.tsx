"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) return
    if (user?.role === "admin") {
      router.replace("/users")
    } else {
      router.replace("/profile")
    }
  }, [user, isAuthenticated, router])

  return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

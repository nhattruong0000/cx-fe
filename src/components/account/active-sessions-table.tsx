"use client"

import { useEffect, useState } from "react"
import {
  Globe,
  Loader2,
  Monitor,
  Smartphone,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { accountApi, type Session } from "@/lib/api/account"

function formatLastActive(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)

  if (diffMin < 1) return "Vừa xong"
  if (diffMin < 60) return `${diffMin} phút trước`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ngày trước`
}

function DeviceIcon({ device }: { device: string }) {
  const lower = device.toLowerCase()
  if (lower.includes("mobile") || lower.includes("phone")) {
    return <Smartphone className="size-4 text-muted-foreground" />
  }
  return <Monitor className="size-4 text-muted-foreground" />
}

export function ActiveSessionsTable() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  async function fetchSessions() {
    try {
      const data = await accountApi.getSessions()
      setSessions(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tải danh sách phiên"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRevoke(sessionId: string) {
    setRevokingId(sessionId)
    try {
      await accountApi.revokeSession(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      toast.success("Đã thu hồi phiên đăng nhập")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Thu hồi thất bại"
      toast.error(message)
    } finally {
      setRevokingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={<Globe className="size-6" />}
        title="Không có phiên đăng nhập"
        description="Không tìm thấy phiên hoạt động nào."
      />
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, idx) => (
        <div key={session.id}>
          {idx > 0 && <Separator className="mb-3" />}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DeviceIcon device={session.device} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {session.browser} — {session.device}
                  </p>
                  {session.is_current && (
                    <Badge variant="success" className="shrink-0">
                      Phiên hiện tại
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {session.ip_address} · {formatLastActive(session.last_active_at)}
                </p>
              </div>
            </div>

            {!session.is_current && (
              <Button
                variant="destructive"
                size="sm"
                disabled={revokingId === session.id}
                onClick={() => handleRevoke(session.id)}
              >
                {revokingId === session.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

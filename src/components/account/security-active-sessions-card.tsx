"use client";

import { Monitor, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useRevokeAllOtherSessions,
  useRevokeSession,
  useSessions,
} from "@/hooks/use-profile";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { Session } from "@/types/profile";

/** Fallback demo sessions shown when the API is unavailable (404 / error) */
const DEMO_SESSIONS: Session[] = [
  {
    id: "demo-1",
    device: "Desktop",
    browser: "Chrome",
    os: "macOS",
    ip_address: "192.168.1.1",
    last_active: new Date(Date.now() - 60_000).toISOString(),
    is_current: true,
  },
  {
    id: "demo-2",
    device: "Mobile",
    browser: "Safari",
    os: "iOS",
    ip_address: "10.0.0.42",
    last_active: new Date(Date.now() - 3_600_000 * 2).toISOString(),
    is_current: false,
  },
  {
    id: "demo-3",
    device: "Desktop",
    browser: "Firefox",
    os: "Windows",
    ip_address: "172.16.0.25",
    last_active: new Date(Date.now() - 86_400_000).toISOString(),
    is_current: false,
  },
];

function SessionRow({
  session,
  onRevoke,
  isRevoking,
  isDemo,
}: {
  session: Session;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
  isDemo: boolean;
}) {
  const isMobile = session.device?.toLowerCase().includes("mobile");
  const DeviceIcon = isMobile ? Smartphone : Monitor;

  return (
    <div
      className={[
        "flex items-start justify-between rounded-lg border p-3 gap-3",
        session.is_current
          ? "bg-[#F0FDF4] border-[#16A34A]"
          : "border-[#E4E4E7]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 min-w-0">
        <DeviceIcon className="size-6 shrink-0 text-[#09090B]" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-medium text-[#09090B]">
              {session.browser} on {session.os}
            </span>
            {session.is_current && (
              <Badge variant="success" className="text-[11px] py-0.5 px-2">
                Hiện tại
              </Badge>
            )}
            {isDemo && (
              <Badge variant="outline" className="text-[11px] py-0.5 px-2">
                Demo
              </Badge>
            )}
          </div>
          <p className="text-[13px] text-[#71717A] mt-0.5">
            IP: {session.ip_address} · Hoạt động lần cuối: {formatRelativeTime(session.last_active)}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={() => {
          if (session.is_current) {
            if (window.confirm("Bạn sẽ bị đăng xuất khỏi phiên hiện tại. Tiếp tục?")) {
              onRevoke(session.id);
            }
          } else {
            onRevoke(session.id);
          }
        }}
        disabled={isRevoking}
        className="shrink-0 bg-[#F4F4F5] text-[#E81B22] hover:bg-[#F4F4F5]/80 hover:text-[#E81B22]"
      >
        Đăng xuất
      </Button>
    </div>
  );
}

/** Lists all active sessions with per-session revoke and bulk sign-out */
export function SecurityActiveSessionsCard() {
  const { data, isError } = useSessions();
  const revokeSession = useRevokeSession();
  const revokeAll = useRevokeAllOtherSessions();

  const isDemo = isError || !data;
  const sessions = isDemo ? DEMO_SESSIONS : data.sessions;
  const otherSessionCount = sessions.filter((s) => !s.is_current).length;

  return (
    <Card>
      <CardHeader className="px-6 pt-4 pb-3 space-y-1.5">
        <CardTitle className="text-[17px] font-semibold tracking-[-0.3px]">
          Phiên hoạt động
        </CardTitle>
        <CardDescription className="text-[13px] leading-normal">
          Quản lý phiên đăng nhập trên các thiết bị khác nhau.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-2 flex flex-col gap-3">
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            isDemo={isDemo}
            onRevoke={(id) => revokeSession.mutate(id)}
            isRevoking={revokeSession.isPending}
          />
        ))}
      </CardContent>

      {otherSessionCount > 0 && (
        <CardFooter className="px-6 pt-3 pb-4 border-t border-[#E4E4E7] justify-end">
          <Button
            variant="outline"
            className="border-[#E81B22] text-[#E81B22] hover:bg-red-50"
            onClick={() => revokeAll.mutate()}
            disabled={revokeAll.isPending || isDemo}
          >
            {revokeAll.isPending ? "Đang đăng xuất..." : "Đăng xuất khỏi tất cả thiết bị khác"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

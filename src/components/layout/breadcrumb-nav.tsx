"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, HomeIcon } from "lucide-react"

const SEGMENT_LABELS: Record<string, string> = {
  profile: "Hồ sơ",
  security: "Bảo mật",
  users: "Người dùng",
  invite: "Mời",
  "permission-groups": "Nhóm quyền",
  "user-groups": "Nhóm người dùng",
  organizations: "Tổ chức",
}

export function BreadcrumbNav({ className }: { className?: string }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1
    // Check if segment is a dynamic ID (UUID or number)
    const isDynamic = /^[0-9a-f-]{8,}$|^\d+$/.test(segment)
    const label = isDynamic
      ? "Chi tiết"
      : SEGMENT_LABELS[segment] ?? segment

    return { href, label, isLast }
  })

  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)} aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <HomeIcon className="size-3.5" />
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRightIcon className="size-3 text-muted-foreground" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

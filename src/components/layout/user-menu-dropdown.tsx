"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { UserIcon, LogOutIcon, ShieldIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserMenuDropdownProps {
  collapsed?: boolean
  showLabel?: boolean
}

export function UserMenuDropdown({
  collapsed,
  showLabel = true,
}: UserMenuDropdownProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?"

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 outline-none transition-colors hover:bg-sidebar-accent",
          collapsed && "justify-center px-2"
        )}
      >
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && showLabel && (
          <div className="flex flex-1 flex-col items-start overflow-hidden">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.full_name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" sideOffset={8} align="start">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.full_name}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <UserIcon />
          Hồ sơ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/security")}>
          <ShieldIcon />
          Bảo mật
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOutIcon />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

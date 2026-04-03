"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, User, Shield, Bell, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { getUserInitials } from "@/lib/user-initials";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { NotificationPopup } from "@/components/layout/notification-popup";
import { useNotifications, useNotificationSubscription } from "@/hooks/use-notifications";

/** Maps pathname segments to breadcrumb labels */
const BREADCRUMB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  profile: "Hồ sơ",
  security: "Bảo mật",
  notifications: "Thông báo",
  invite: "Invite User",
  "permission-groups": "Permission Groups",
  organizations: "Organizations",
  settings: "Cài đặt",
  help: "Help Center",
};

/** Maps pathname segments to their parent breadcrumb label */
const PARENT_MAP: Record<string, string> = {
  dashboard: "Admin",
  users: "Admin",
  "permission-groups": "Admin",
  organizations: "Admin",
  settings: "Cài đặt",
  invite: "Quick Actions",
  help: "Quick Actions",
  profile: "Cài đặt",
  security: "Cài đặt",
  notifications: "Cài đặt",
};

/** Top bar with breadcrumb + user area (no logo — logo is in sidebar) */
export function DashboardTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [imgError, setImgError] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { data: notifData } = useNotifications("all", 1);
  useNotificationSubscription();

  const initials = getUserInitials(user?.full_name);
  const showAvatar = user?.avatar_url && !imgError;

  // Derive breadcrumb from pathname
  const segment = pathname.split("/").filter(Boolean).pop() ?? "dashboard";
  const breadcrumb = BREADCRUMB_MAP[segment] ?? segment;
  const parent = PARENT_MAP[segment] ?? "Admin";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E4E4E7] bg-white px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#71717A]">{parent}</span>
        <ChevronRight className="h-3.5 w-3.5 text-[#71717A]" />
        <span className="text-sm font-medium text-[#09090B]">{breadcrumb}</span>
      </div>

      {/* User area: bell + avatar */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger className="relative flex h-8 w-8 items-center justify-center rounded-md outline-none transition-colors hover:bg-[#F1F5F9]">
            <Bell className="h-5 w-5 text-[#71717A]" />
            {(notifData?.unreadCount ?? 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E81B22] text-[10px] font-semibold text-white">
                {notifData?.unreadCount}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-auto rounded-[14px] p-0 shadow-[0_4px_8px_-1px_rgba(0,0,0,0.04),0_12px_24px_-2px_rgba(0,0,0,0.09)]"
          >
            <NotificationPopup onClose={() => setPopoverOpen(false)} />
          </PopoverContent>
        </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="rounded-full outline-none transition-opacity hover:opacity-80"
        >
            {showAvatar ? (
              <img
                src={user.avatar_url!}
                alt={user.full_name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#2556C5]"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted ring-2 ring-[#2556C5]">
                <span className="text-sm font-medium text-muted-foreground">
                  {initials}
                </span>
              </div>
            )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-[280px] rounded-xl">
          {/* User info header */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#09090B]">{user?.full_name}</p>
              <p className="truncate text-xs text-[#71717A]">{user?.email}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Navigation items */}
          <DropdownMenuItem className="gap-2.5" onClick={() => router.push("/profile")}>
            <User className="h-4 w-4 text-[#71717A]" />
            Hồ sơ
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2.5" onClick={() => router.push("/security")}>
            <Shield className="h-4 w-4 text-[#71717A]" />
            Bảo mật
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2.5" onClick={() => router.push("/notifications")}>
            <Bell className="h-4 w-4 text-[#71717A]" />
            Thông báo
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem variant="destructive" onClick={handleLogout} className="gap-2.5">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </div>
  );
}

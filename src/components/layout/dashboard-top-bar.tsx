"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { BarChart3, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { getUserInitials } from "@/lib/user-initials";

/** Maps pathname segments to breadcrumb labels */
const BREADCRUMB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  profile: "Profile",
  security: "Security",
  notifications: "Notifications",
  invite: "Invite User",
  "permission-groups": "Permission Groups",
  organizations: "Organizations",
  settings: "Settings",
  help: "Help Center",
};

/** Maps pathname segments to their parent breadcrumb label */
const PARENT_MAP: Record<string, string> = {
  dashboard: "Admin",
  users: "Admin",
  "permission-groups": "Admin",
  organizations: "Admin",
  settings: "Admin",
  invite: "Quick Actions",
  help: "Quick Actions",
  profile: "Settings",
  security: "Settings",
  notifications: "Settings",
};

/** Top bar with logo + breadcrumb + notification + avatar */
export function DashboardTopBar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [imgError, setImgError] = useState(false);

  const initials = getUserInitials(user?.full_name);
  const showAvatar = user?.avatar_url && !imgError;

  // Derive breadcrumb from pathname
  const segment = pathname.split("/").filter(Boolean).pop() ?? "dashboard";
  const breadcrumb = BREADCRUMB_MAP[segment] ?? segment;
  const parent = PARENT_MAP[segment] ?? "Admin";

  return (
    <div className="flex h-16 items-center border-b border-[#E4E4E7] bg-white">
      {/* Logo section — aligned with sidebar width */}
      <div className="flex h-full w-[260px] items-center gap-2.5 px-3.5">
        <BarChart3 className="h-6 w-6 text-[#2556C5]" />
        <span className="text-[17px] font-bold text-[#0F172A]">SonNguyen CX</span>
      </div>

      {/* Header section */}
      <div className="flex h-full flex-1 items-center justify-between px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1">
          <span className="text-[13px] text-[#71717A]">{parent}</span>
          <span className="text-[13px] text-[#71717A]">/</span>
          <span className="text-[13px] font-medium text-[#09090B]">{breadcrumb}</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-[#71717A]" />
          {showAvatar ? (
            <img
              src={user.avatar_url!}
              alt={user.full_name}
              className="h-8 w-8 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-xs font-semibold text-white">
              {initials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

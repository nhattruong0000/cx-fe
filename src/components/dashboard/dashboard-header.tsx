"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getUserInitials } from "@/lib/user-initials";

interface DashboardHeaderProps {
  title: string;
  breadcrumb?: string[];
}

export function DashboardHeader({ title, breadcrumb }: DashboardHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const [imgError, setImgError] = useState(false);
  const initials = getUserInitials(user?.full_name);
  const showAvatar = user?.avatar_url && !imgError;

  return (
    <div className="mb-6 space-y-6">
      {/* IMPORTANT: -mx-8 -mt-8 offsets the p-8 padding from layout.tsx <main> */}
      <div className="-mx-8 -mt-8 flex h-14 items-center justify-between border-b border-[#E4E4E7] px-8">
        <span className="text-sm text-[#71717A]">
          {breadcrumb?.join(" / ") ?? title}
        </span>
        <div className="flex items-center gap-3">
          {showAvatar ? (
            <img
              src={user.avatar_url!}
              alt={user.full_name}
              className="h-8 w-8 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F5] text-xs font-medium text-[#71717A]">
              {initials}
            </div>
          )}
          <span className="text-sm font-medium text-[#09090B]">{user?.full_name}</span>
        </div>
      </div>

      {/* Title bar */}
      <h1 className="text-2xl font-semibold text-[#09090B]">{title}</h1>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types/common";

interface PermissionGateProps {
  children: React.ReactNode;
  /** Roles allowed to view this content */
  allowedRoles?: UserRole[];
  /** Redirect path when unauthorized (default: /) */
  redirectTo?: string;
  /** Show fallback instead of redirect */
  fallback?: React.ReactNode;
}

/** Restricts content to users with specific roles */
export function PermissionGate({
  children,
  allowedRoles = ["admin"],
  redirectTo = "/",
  fallback,
}: PermissionGateProps) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();

  const hasAccess = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasAccess && !fallback) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, hasAccess, fallback, redirectTo, router]);

  if (isLoading) return null;
  if (!hasAccess) return fallback ?? null;

  return <>{children}</>;
}

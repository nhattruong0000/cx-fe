"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";

interface PermissionGateProps {
  permissions: string[];
  adminOnly?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permissions,
  adminOnly,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { canAny, role } = usePermissions();

  if (adminOnly && role !== "admin") return <>{fallback}</>;
  if (!canAny(permissions)) return <>{fallback}</>;

  return <>{children}</>;
}

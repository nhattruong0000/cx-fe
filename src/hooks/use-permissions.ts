import { useAuthStore } from "@/stores/auth-store";
import { hasPermission, hasAnyPermission } from "@/lib/permissions";

export function usePermissions() {
  const user = useAuthStore((s) => s.user);

  const can = (permission: string) =>
    user?.role === "admin" ||
    hasPermission(user?.permissions || [], permission);

  const canAny = (permissions: string[]) =>
    permissions.length === 0 ||
    user?.role === "admin" ||
    hasAnyPermission(user?.permissions || [], permissions);

  return { can, canAny, role: user?.role };
}

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";

/** Hydrates auth + sidebar state from localStorage on mount. Place in root layout. */
export function AuthHydration() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateSidebar = useSidebarStore((s) => s.hydrate);

  useEffect(() => {
    hydrateAuth();
    hydrateSidebar();
  }, [hydrateAuth, hydrateSidebar]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

/** Hydrates auth state from localStorage on mount. Place in root layout. */
export function AuthHydration() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}

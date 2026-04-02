"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getMe } from "@/lib/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { tokens, setUser, setTokens, setLoading, logout } = useAuthStore();

  useEffect(() => {
    async function validateSession() {
      // Wait for Zustand persist to hydrate tokens from sessionStorage
      if (!useAuthStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          useAuthStore.persist.onFinishHydration(() => resolve());
        });
      }

      const hydratedTokens = useAuthStore.getState().tokens;
      if (!hydratedTokens?.access_token) {
        setLoading(false);
        return;
      }

      // Re-sync cookie on hydration (persist restores tokens but cookie is lost on reload)
      setTokens(hydratedTokens);

      try {
        const res = await getMe();
        setUser(res.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    validateSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}

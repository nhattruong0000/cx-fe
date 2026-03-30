"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getMe } from "@/lib/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { tokens, setUser, setTokens, setLoading, logout } = useAuthStore();

  useEffect(() => {
    async function validateSession() {
      if (!tokens?.access_token) {
        setLoading(false);
        return;
      }

      // Re-sync cookie on hydration (persist restores tokens but cookie is lost on reload)
      setTokens(tokens);

      try {
        const user = await getMe();
        setUser(user);
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

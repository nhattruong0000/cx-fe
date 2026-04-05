"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getMe } from "@/lib/api/auth";
import type { TokenPair } from "@/types/auth";

/** Read tokens directly from sessionStorage, bypassing Zustand hydration timing */
function readTokensFromStorage(): TokenPair | null {
  try {
    const raw = sessionStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.tokens ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setTokens, setLoading, logout } = useAuthStore();

  const validateSession = useCallback(async () => {
    const tokens =
      useAuthStore.getState().tokens ?? readTokensFromStorage();

    if (!tokens?.access_token) {
      // Clear stale user from sessionStorage if tokens are missing
      if (useAuthStore.getState().user) logout();
      setLoading(false);
      return;
    }

    setTokens(tokens);

    try {
      const res = await getMe();
      setUser(res.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [setUser, setTokens, setLoading, logout]);

  // Validate on mount
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  // Re-validate when user returns to tab (e.g. after leaving overnight)
  useEffect(() => {
    const onFocus = () => validateSession();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [validateSession]);

  return <>{children}</>;
}

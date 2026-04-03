"use client";

import { useEffect, type ReactNode } from "react";
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

  useEffect(() => {
    async function validateSession() {
      // Read tokens from Zustand store OR directly from sessionStorage.
      // This avoids relying on Zustand's async hydration timing which causes
      // race conditions on back-navigation from 404 pages.
      const tokens =
        useAuthStore.getState().tokens ?? readTokensFromStorage();

      if (!tokens?.access_token) {
        setLoading(false);
        return;
      }

      // Sync tokens to store + cookie (persist may not have hydrated yet)
      setTokens(tokens);

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

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TokenPair, User } from "@/types/auth";

interface AuthState {
  user: User | null;
  tokens: TokenPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: TokenPair | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/** Sync access_token to cookie so Next.js middleware can read it */
function syncTokenCookie(tokens: TokenPair | null) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  if (tokens?.access_token) {
    document.cookie = `access_token=${tokens.access_token}; path=/; max-age=86400; SameSite=Lax${secure}`;
  } else {
    document.cookie = `access_token=; path=/; max-age=0; SameSite=Lax${secure}`;
  }
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({ user, isAuthenticated: user !== null }),

      setTokens: (tokens) => {
        syncTokenCookie(tokens);
        set({ tokens });
      },

      logout: () => {
        syncTokenCookie(null);
        set({ user: null, tokens: null, isAuthenticated: false });
      },

      setLoading: (isLoading) =>
        set({ isLoading }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      /** Persist tokens + user for instant layout render; user re-validated on mount via AuthProvider */
      partialize: (state) => ({ tokens: state.tokens, user: state.user }),
    }
  )
);

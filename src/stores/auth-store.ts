import { create } from "zustand";
import type { User } from "@/types/common";

const mockUser: User = {
  id: "usr-admin-001",
  email: "admin@cxapp.vn",
  name: "Quản trị viên",
  role: "admin",
  createdAt: "2026-01-01T00:00:00Z",
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  /** Hydrate auth state from localStorage (call once on mount) */
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("cx-auth");
    if (stored === "true") {
      set({ user: mockUser, isAuthenticated: true });
    }
  },

  login: async (_email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("cx-auth", "true");
    document.cookie = "cx-auth=true; path=/; max-age=86400; SameSite=Lax";
    set({ user: mockUser, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("cx-auth");
    document.cookie = "cx-auth=; path=/; max-age=0";
    set({ user: null, isAuthenticated: false });
  },
}));

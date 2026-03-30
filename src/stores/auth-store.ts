import { create } from "zustand";
import type { User } from "@/types/common";
import { authApi } from "@/lib/api/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  activeOrganizationId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => void;
  fetchMe: () => Promise<void>;
  setActiveOrganization: (orgId: string) => void;
  clearError: () => void;
}

const ACTIVE_ORG_KEY = "cx-active-org";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  activeOrganizationId: null,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("cx-token");
    const activeOrg = localStorage.getItem(ACTIVE_ORG_KEY);
    if (activeOrg) {
      set({ activeOrganizationId: activeOrg });
    }
    if (token) {
      get().fetchMe();
    }
  },

  fetchMe: async () => {
    try {
      set({ isLoading: true });
      const user = await authApi.getMe();
      const activeOrg = get().activeOrganizationId;
      // Auto-select first org if none selected
      const orgId =
        activeOrg ||
        user.active_organization_id ||
        user.organizations?.[0]?.organization_id ||
        null;
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        activeOrganizationId: orgId,
      });
      if (orgId) {
        localStorage.setItem(ACTIVE_ORG_KEY, orgId);
      }
    } catch {
      localStorage.removeItem("cx-token");
      localStorage.removeItem("cx-refresh-token");
      document.cookie = "cx-auth=; path=/; max-age=0";
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem("cx-token", data.tokens.access_token);
      localStorage.setItem("cx-refresh-token", data.tokens.refresh_token);
      document.cookie = "cx-auth=true; path=/; max-age=86400; SameSite=Lax";

      // Store role in cookie for middleware route guard
      document.cookie = `cx-role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;

      // Fetch full user profile with permissions
      await get().fetchMe();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Đăng nhập thất bại";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors
    }
    localStorage.removeItem("cx-token");
    localStorage.removeItem("cx-refresh-token");
    localStorage.removeItem(ACTIVE_ORG_KEY);
    document.cookie = "cx-auth=; path=/; max-age=0";
    document.cookie = "cx-role=; path=/; max-age=0";
    set({
      user: null,
      isAuthenticated: false,
      activeOrganizationId: null,
      error: null,
    });
  },

  setActiveOrganization: (orgId: string) => {
    localStorage.setItem(ACTIVE_ORG_KEY, orgId);
    set({ activeOrganizationId: orgId });
  },

  clearError: () => set({ error: null }),
}));

import { create } from "zustand";

const SIDEBAR_KEY = "cx-sidebar-collapsed";

interface SidebarState {
  collapsed: boolean;
  mounted: boolean;
  toggle: () => void;
  /** Hydrate sidebar state from localStorage (call once on mount) */
  hydrate: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  mounted: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(SIDEBAR_KEY);
    set({ collapsed: stored === "true", mounted: true });
  },

  toggle: () => {
    set((state) => {
      const next = !state.collapsed;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return { collapsed: next };
    });
  },
}));

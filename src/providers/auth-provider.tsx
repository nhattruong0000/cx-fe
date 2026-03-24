"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { User } from "@/types/common";

const mockUser: User = {
  id: "usr-admin-001",
  email: "admin@cxapp.vn",
  name: "Quản trị viên",
  role: "admin",
  createdAt: "2026-01-01T00:00:00Z",
};

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("cx-auth");
    return stored === "true" ? mockUser : null;
  });

  const login = useCallback(async (_email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("cx-auth", "true");
    document.cookie = "cx-auth=true; path=/; max-age=86400; SameSite=Lax";
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cx-auth");
    document.cookie = "cx-auth=; path=/; max-age=0";
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

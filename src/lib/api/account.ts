import { apiClient } from "./client"
import type { User } from "@/types/common"

export interface UpdateProfileData {
  full_name: string
  phone?: string
  timezone?: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface Session {
  id: string
  device: string
  browser: string
  ip_address: string
  last_active_at: string
  is_current: boolean
}

export const accountApi = {
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const res = await apiClient.patch<{ user: User }>(
      "/api/v1/auth/me",
      data
    )
    return res.user
  },

  changePassword: (data: ChangePasswordData) =>
    apiClient.post<void>("/api/v1/auth/passwords/change", data),

  getSessions: async (): Promise<Session[]> => {
    const res = await apiClient.get<{ sessions: Session[] }>(
      "/api/v1/auth/sessions/active"
    )
    return res.sessions
  },

  revokeSession: (sessionId: string) =>
    apiClient.delete<void>(`/api/v1/auth/sessions/${sessionId}`),

  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData()
    formData.append("avatar", file)

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("cx-token")
        : null

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    const res = await fetch(`${baseUrl}/api/v1/auth/me/avatar`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Upload failed" }))
      throw new Error(err.message || "Upload failed")
    }

    return res.json()
  },
}

import { apiClient } from "./client";
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  SessionsResponse,
  TwoFactorStatus,
  NotificationPreference,
  NotificationPreferencesResponse,
} from "@/types/profile";

export function getProfile(): Promise<UpdateProfileResponse> {
  return apiClient.get<UpdateProfileResponse>("/api/v1/auth/profile");
}

export function updateProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  return apiClient.patch<UpdateProfileResponse>("/api/v1/auth/profile", data);
}

export function changePassword(
  data: ChangePasswordRequest
): Promise<{ message: string }> {
  return apiClient.patch<{ message: string }>(
    "/api/v1/auth/password",
    {
      current_password: data.current_password,
      password: data.new_password,
      password_confirmation: data.new_password_confirmation,
    }
  );
}

export function getSessions(): Promise<SessionsResponse> {
  return apiClient.get<SessionsResponse>("/api/v1/profile/sessions");
}

export function revokeSession(sessionId: string): Promise<void> {
  if (!sessionId || /[/\\]/.test(sessionId)) {
    return Promise.reject(new Error("Invalid session ID"));
  }
  return apiClient.delete<void>(`/api/v1/profile/sessions/${sessionId}`);
}

export function revokeAllOtherSessions(): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(
    "/api/v1/profile/sessions"
  );
}

export function get2FAStatus(): Promise<TwoFactorStatus> {
  return apiClient.get<TwoFactorStatus>("/api/v1/profile/2fa");
}

export function enable2FA(method: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/api/v1/profile/2fa", {
    method,
  });
}

export function disable2FA(): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>("/api/v1/profile/2fa");
}

export function getNotificationPreferences(): Promise<NotificationPreferencesResponse> {
  return apiClient.get<NotificationPreferencesResponse>(
    "/api/v1/notification_preferences"
  );
}

export function updateNotificationPreference(
  key: string,
  enabled: boolean
): Promise<NotificationPreference> {
  const fieldMap: Record<string, string> = {
    email_notifications: "email_enabled",
    push_notifications: "push_enabled",
    weekly_digest: "weekly_digest",
  };
  const field = fieldMap[key];
  if (!field) throw new Error(`Unknown preference key: ${key}`);
  return apiClient.patch<NotificationPreference>(
    "/api/v1/notification_preferences",
    { [field]: enabled }
  );
}

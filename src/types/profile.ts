import type { User } from "./auth";

export interface UpdateProfileRequest {
  full_name: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface Session {
  id: string;
  device: string;
  ip_address: string;
  last_active: string;
  is_current: boolean;
  browser: string;
  os: string;
}

export interface NotificationPreference {
  key: string;
  label: string;
  description: string;
  type: string;
  enabled: boolean;
}

export interface UpdateProfileResponse {
  user: User;
}

export interface SessionsResponse {
  sessions: Session[];
}

export interface NotificationPreferencesResponse {
  preferences: NotificationPreference[];
  weekly_digest: boolean;
}

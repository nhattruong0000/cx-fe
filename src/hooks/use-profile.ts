import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  changePassword,
  getSessions,
  revokeSession,
  revokeAllOtherSessions,
  get2FAStatus,
  enable2FA,
  disable2FA,
  getNotificationPreferences,
  updateNotificationPreference,
} from "@/lib/api/profile";
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/profile";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 60_000,
    retry: 2,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });
}

export function useSessions() {
  return useQuery({
    queryKey: ["profile-sessions"],
    queryFn: getSessions,
    staleTime: 30_000,
    retry: 2,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-sessions"] });
    },
  });
}

export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeAllOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-sessions"] });
    },
  });
}

export function use2FAStatus() {
  return useQuery({
    queryKey: ["2fa-status"],
    queryFn: get2FAStatus,
    staleTime: 60_000,
    retry: 2,
  });
}

export function useEnable2FA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (method: string) => enable2FA(method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] });
    },
  });
}

export function useDisable2FA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disable2FA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] });
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["notification-preferences"],
    queryFn: getNotificationPreferences,
    staleTime: 60_000,
    retry: 2,
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      updateNotificationPreference(key, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
  });
}

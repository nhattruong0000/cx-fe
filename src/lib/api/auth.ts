import { apiClient } from './client';
import type { User } from '@/types/common';
import type {
  AcceptInviteData,
  InvitationValidation,
  LoginResponse,
  ResetPasswordData,
  TokenValidation,
} from '@/types/auth';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/api/v1/auth/sessions', { email, password }),

  logout: () =>
    apiClient.delete<void>('/api/v1/auth/sessions'),

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<{ user: User }>('/api/v1/auth/me');
    return res.user;
  },

  validateInvitation: (code: string) =>
    apiClient.get<InvitationValidation>(`/api/v1/auth/invitations/${code}/validate`),

  acceptInvitation: (code: string, data: AcceptInviteData) =>
    apiClient.post<LoginResponse>(`/api/v1/auth/invitations/${code}/accept`, data),

  forgotPassword: (email: string) =>
    apiClient.post<void>('/api/v1/auth/passwords/forgot', { email }),

  validateResetToken: (token: string) =>
    apiClient.get<TokenValidation>(`/api/v1/auth/passwords/validate/${token}`),

  resetPassword: (data: ResetPasswordData) =>
    apiClient.post<void>('/api/v1/auth/passwords/reset', data),
};

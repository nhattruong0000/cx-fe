import type { UserRole } from './common';

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface AcceptInviteData {
  full_name: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface InvitationValidation {
  email: string;
  role: UserRole;
  inviter_name: string;
  organization_name?: string;
  expires_at: string;
  status: 'valid' | 'expired' | 'accepted' | 'invalid';
}

export interface TokenValidation {
  valid: boolean;
  status: 'valid' | 'expired' | 'invalid';
}

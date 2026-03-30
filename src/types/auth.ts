export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: TokenPair;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  email?: string;
}

export interface InvitationDetails {
  email: string;
  role: string;
  inviter_name: string;
  organization_name: string;
  expires_at: string;
  status: string;
}

export interface AcceptInviteRequest {
  full_name: string;
  password: string;
  password_confirmation: string;
}

export interface AcceptInviteResponse {
  user: User;
  tokens: TokenPair;
}

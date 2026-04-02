import { apiClient } from "./client";
import type {
  AcceptInviteRequest,
  AcceptInviteResponse,
  InvitationDetails,
  LoginResponse,
  ResetPasswordRequest,
  User,
  ValidateTokenResponse,
} from "@/types/auth";

export function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>(
    "/api/v1/auth/sessions",
    { email, password }
  );
}

export function refreshToken(
  refresh_token: string
): Promise<{ tokens: { access_token: string; refresh_token: string } }> {
  return apiClient.post("/api/v1/auth/sessions/refresh", {
    refresh_token,
  });
}

export function forgotPassword(
  email: string
): Promise<{ message: string }> {
  return apiClient.post("/api/v1/auth/passwords/forgot", { email });
}

export function validateResetToken(
  token: string
): Promise<ValidateTokenResponse> {
  return apiClient.get<ValidateTokenResponse>(
    `/api/v1/auth/passwords/validate/${token}`
  );
}

export function resetPassword(
  data: ResetPasswordRequest
): Promise<{ message: string }> {
  return apiClient.post("/api/v1/auth/passwords/reset", data);
}

export function validateInvitation(
  code: string
): Promise<InvitationDetails> {
  return apiClient.get<InvitationDetails>(
    `/api/v1/auth/invitations/${code}/validate`
  );
}

export function acceptInvitation(
  code: string,
  data: AcceptInviteRequest
): Promise<AcceptInviteResponse> {
  return apiClient.post<AcceptInviteResponse>(
    `/api/v1/auth/invitations/${code}/accept`,
    data
  );
}

export function getMe(): Promise<{ user: User }> {
  return apiClient.get<{ user: User }>("/api/v1/auth/me");
}

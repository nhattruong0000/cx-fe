/** API client functions for customer organization endpoints */

import { apiClient } from "./client";
import type {
  MyOrganizationResponse,
  OrgMembersResponse,
  OrgMembersParams,
  InviteMemberRequest,
  UpdateMemberRequest,
  OrgMember,
  OrgInvitation,
  OrgInvitationsResponse,
} from "@/types/customer-organization";

const BASE = "/api/v1/customer/my-organization";

export async function getMyOrganization(): Promise<MyOrganizationResponse> {
  return apiClient.get<MyOrganizationResponse>(BASE);
}

export async function getOrgMembers(
  params: OrgMembersParams = {}
): Promise<OrgMembersResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.per_page !== undefined) query.set("per_page", String(params.per_page));
  if (params.q) query.set("q", params.q);
  const qs = query.toString();
  return apiClient.get<OrgMembersResponse>(`${BASE}/members${qs ? `?${qs}` : ""}`);
}

export function inviteOrgMember(
  data: InviteMemberRequest
): Promise<{ invitation: OrgInvitation }> {
  return apiClient.post<{ invitation: OrgInvitation }>(`${BASE}/invite`, data);
}

export async function getOrgInvitations(): Promise<OrgInvitationsResponse> {
  return apiClient.get<OrgInvitationsResponse>(`${BASE}/invitations`);
}

export function resendOrgInvitation(
  invitationId: number
): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(`${BASE}/invitations/${invitationId}/resend`);
}

export function cancelOrgInvitation(
  invitationId: number
): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`${BASE}/invitations/${invitationId}`);
}

export function updateOrgMember(
  userId: number,
  data: UpdateMemberRequest
): Promise<{ member: OrgMember }> {
  return apiClient.patch<{ member: OrgMember }>(`${BASE}/members/${userId}`, data);
}

export function removeOrgMember(
  userId: number
): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`${BASE}/members/${userId}`);
}

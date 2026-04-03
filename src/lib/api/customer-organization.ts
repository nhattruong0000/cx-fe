/** API client functions for customer organization endpoints */

import { apiClient } from "./client";
import type {
  MyOrganizationResponse,
  OrgMembersResponse,
  OrgMembersParams,
  AddMemberRequest,
  UpdateMemberRequest,
  OrgMember,
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

export function addOrgMember(
  data: AddMemberRequest
): Promise<{ member: OrgMember }> {
  return apiClient.post<{ member: OrgMember }>(`${BASE}/members`, data);
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

import { apiClient } from "./client";
import type {
  AdminUsersResponse,
  AdminUsersParams,
  InviteUserRequest,
  AdminGroupsResponse,
} from "@/types/admin";

export function getAdminUsers(
  params: AdminUsersParams = {}
): Promise<AdminUsersResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined)
    query.set("page_size", String(params.page_size));
  if (params.search) query.set("search", params.search);
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);

  const qs = query.toString();
  return apiClient.get<AdminUsersResponse>(
    `/api/v1/admin/users${qs ? `?${qs}` : ""}`
  );
}

export function inviteUser(
  data: InviteUserRequest
): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/api/v1/admin/users/invite", data);
}

export function getAdminGroups(): Promise<AdminGroupsResponse> {
  return apiClient.get<AdminGroupsResponse>("/api/v1/admin/groups");
}

import { apiClient } from "./client";
import type {
  AdminUsersResponse,
  AdminUsersApiResponse,
  AdminUsersParams,
  InviteUserRequest,
  AdminGroupsResponse,
} from "@/types/admin";

export async function getAdminUsers(
  params: AdminUsersParams = {}
): Promise<AdminUsersResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.per_page !== undefined) query.set("per_page", String(params.per_page));
  if (params.q) query.set("q", params.q);
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);

  const qs = query.toString();
  const raw = await apiClient.get<AdminUsersApiResponse>(
    `/api/v1/admin/users${qs ? `?${qs}` : ""}`
  );

  // Map BE pagination shape to FE-friendly shape
  return {
    users: raw.users,
    total: raw.pagination.total_count,
    page: raw.pagination.current_page,
    page_size: params.per_page ?? 25,
  };
}

export function inviteUser(
  data: InviteUserRequest
): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/api/v1/admin/invitations", data);
}

export async function getAdminGroups(): Promise<AdminGroupsResponse> {
  const raw = await apiClient.get<{ permission_groups: AdminGroupsResponse["groups"] }>(
    "/api/v1/admin/permission-groups"
  );
  return { groups: raw.permission_groups };
}

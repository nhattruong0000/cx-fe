import { apiClient } from "./client";
import type {
  AdminUserDetail,
  AssignRoleRequest,
  SuspendUserRequest,
  UpdateUserInfoRequest,
} from "@/types/admin";

export function getAdminUser(id: string): Promise<{ user: AdminUserDetail }> {
  return apiClient.get(`/api/v1/admin/users/${id}`);
}

export function assignUserRole(id: string, data: AssignRoleRequest) {
  return apiClient.post(`/api/v1/admin/users/${id}/assign_role`, data);
}

export function suspendUser(id: string, data: SuspendUserRequest) {
  return apiClient.post(`/api/v1/admin/users/${id}/suspend`, data);
}

export function unsuspendUser(id: string) {
  return apiClient.post(`/api/v1/admin/users/${id}/unsuspend`, {});
}

export function updateUserInfo(
  id: string,
  data: UpdateUserInfoRequest
): Promise<{ user: AdminUserDetail }> {
  return apiClient.patch(`/api/v1/admin/users/${id}`, data);
}

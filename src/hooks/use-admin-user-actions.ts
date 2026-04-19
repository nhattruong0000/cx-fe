import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUser,
  assignUserRole,
  suspendUser,
  unsuspendUser,
  updateUserInfo,
} from "@/lib/api/admin-user-actions";
import type { UpdateUserInfoRequest } from "@/types/admin";

export function useAdminUserDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getAdminUser(id!),
    enabled: !!id,
  });
}

export function useAssignRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      assignUserRole(id, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      suspendUser(id, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useUnsuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unsuspendUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useUpdateUserInfo(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserInfoRequest) => updateUserInfo(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-user", userId] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

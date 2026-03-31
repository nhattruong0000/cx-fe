import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  inviteUser,
  getAdminGroups,
} from "@/lib/api/admin-users";
import type { AdminUsersParams, InviteUserRequest } from "@/types/admin";

export function useAdminUsers(params: AdminUsersParams = {}) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAdminUsers(params),
    staleTime: 30_000,
    retry: 2,
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteUserRequest) => inviteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useAdminGroups() {
  return useQuery({
    queryKey: ["admin-groups"],
    queryFn: getAdminGroups,
    staleTime: 300_000,
    retry: 2,
  });
}

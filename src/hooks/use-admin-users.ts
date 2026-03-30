import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/admin-users';
import type { InviteUserData, UpdateUserData } from '@/types/admin';

export function useUsers(params?: { page?: number; role?: string; q?: string }) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminUsersApi.list({ per_page: 20, ...params }),
  });
}

export function useInviteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteUserData) => adminUsersApi.invite(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      adminUsersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminUsersApi.suspend(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useUnsuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminUsersApi.unsuspend(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

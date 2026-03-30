import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGroupsApi } from '@/lib/api/admin-groups';
import type { CreateGroupData } from '@/types/admin';

export function usePermissionGroups() {
  return useQuery({
    queryKey: ['admin-groups'],
    queryFn: () => adminGroupsApi.list(),
  });
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGroupData) => adminGroupsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-groups'] }),
  });
}

export function useUpdateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGroupData> }) =>
      adminGroupsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-groups'] }),
  });
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminGroupsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-groups'] }),
  });
}

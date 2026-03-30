import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrgsApi } from '@/lib/api/admin-orgs';

export function useOrganizations(params?: { page?: number; q?: string; status?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['admin-orgs', params],
    queryFn: () => adminOrgsApi.list(params),
  });
}

export function useOrgDetail(id: string | null) {
  return useQuery({
    queryKey: ['admin-org-detail', id],
    queryFn: () => adminOrgsApi.detail(id!),
    enabled: !!id,
  });
}

export function useAddOrgMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: { email: string; org_role: string } }) =>
      adminOrgsApi.addMember(orgId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-org-detail'] });
      qc.invalidateQueries({ queryKey: ['admin-orgs'] });
    },
  });
}

export function useUpdateOrgMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orgId,
      userId,
      data,
    }: {
      orgId: string;
      userId: number;
      data: { org_role?: string; permissions?: string[] };
    }) => adminOrgsApi.updateMember(orgId, userId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-org-detail'] }),
  });
}

export function useRemoveOrgMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, userId }: { orgId: string; userId: number }) =>
      adminOrgsApi.removeMember(orgId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-org-detail'] });
      qc.invalidateQueries({ queryKey: ['admin-orgs'] });
    },
  });
}

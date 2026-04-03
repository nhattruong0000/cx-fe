/** React Query hooks for customer organization management */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyOrganization,
  getOrgMembers,
  addOrgMember,
  updateOrgMember,
  removeOrgMember,
} from "@/lib/api/customer-organization";
import type {
  OrgMembersParams,
  AddMemberRequest,
  UpdateMemberRequest,
} from "@/types/customer-organization";

export function useMyOrganization() {
  return useQuery({
    queryKey: ["my-organization"],
    queryFn: getMyOrganization,
    staleTime: 30_000,
    retry: 2,
  });
}

export function useOrgMembers(params: OrgMembersParams = {}) {
  return useQuery({
    queryKey: ["org-members", params],
    queryFn: () => getOrgMembers(params),
    staleTime: 30_000,
    retry: 2,
  });
}

export function useAddOrgMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddMemberRequest) => addOrgMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-members"] });
      queryClient.invalidateQueries({ queryKey: ["my-organization"] });
    },
  });
}

export function useUpdateOrgMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateMemberRequest }) =>
      updateOrgMember(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-members"] });
    },
  });
}

export function useRemoveOrgMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => removeOrgMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-members"] });
      queryClient.invalidateQueries({ queryKey: ["my-organization"] });
    },
  });
}

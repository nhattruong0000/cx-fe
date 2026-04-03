/** React Query hooks for customer organization management */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyOrganization,
  getOrgMembers,
  inviteOrgMember,
  updateOrgMember,
  removeOrgMember,
  getOrgInvitations,
  resendOrgInvitation,
  cancelOrgInvitation,
} from "@/lib/api/customer-organization";
import type {
  OrgMembersParams,
  InviteMemberRequest,
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

export function useInviteOrgMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteMemberRequest) => inviteOrgMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["org-members"] });
      queryClient.invalidateQueries({ queryKey: ["my-organization"] });
    },
  });
}

export function useOrgInvitations() {
  return useQuery({
    queryKey: ["org-invitations"],
    queryFn: getOrgInvitations,
    staleTime: 30_000,
  });
}

export function useResendOrgInvitation() {
  return useMutation({
    mutationFn: (invitationId: number) => resendOrgInvitation(invitationId),
  });
}

export function useCancelOrgInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: number) => cancelOrgInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-invitations"] });
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminInvitations,
  resendInvitation,
  deleteInvitation,
} from "@/lib/api/admin-users";
import type { AdminInvitationsParams } from "@/types/admin";

/** Fetch paginated invitations with optional status/search filters. */
export function useAdminInvitations(params: AdminInvitationsParams = {}) {
  return useQuery({
    queryKey: ["admin-invitations", params],
    queryFn: () => getAdminInvitations(params),
    staleTime: 30_000,
    retry: 2,
  });
}

/** Resend invitation email — invalidates list on success. */
export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resendInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invitations"] });
    },
  });
}

/** Delete an invitation — invalidates list on success. */
export function useDeleteInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invitations"] });
    },
  });
}

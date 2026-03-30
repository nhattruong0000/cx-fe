import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportRequestsApi } from '@/lib/api/support-requests';
import { customerSupportApi } from '@/lib/api/customer-support';
import type { AssignRequestData, CreateSupportRequestData, StaffCreateSupportRequestData } from '@/types/support';

// Staff hooks
export function useSupportRequests(params?: { page?: number; status?: string; q?: string }) {
  return useQuery({
    queryKey: ['support-requests', params],
    queryFn: () => supportRequestsApi.list(params),
  });
}

export function useSupportCalendar(month?: string, year?: string) {
  return useQuery({
    queryKey: ['support-calendar', month, year],
    queryFn: () => supportRequestsApi.calendar({ month, year }),
  });
}

export function useSupportDetail(id: number) {
  return useQuery({
    queryKey: ['support-request', id],
    queryFn: () => supportRequestsApi.detail(id),
  });
}

export function useTechnicians() {
  return useQuery({
    queryKey: ['technicians'],
    queryFn: () => supportRequestsApi.technicians(),
  });
}

export function useAssignRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AssignRequestData }) =>
      supportRequestsApi.assign(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support-requests'] });
      qc.invalidateQueries({ queryKey: ['support-request'] });
      qc.invalidateQueries({ queryKey: ['support-calendar'] });
    },
  });
}

export function useUpdateSupportStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { new_status: string; result_note?: string } }) =>
      supportRequestsApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support-requests'] });
      qc.invalidateQueries({ queryKey: ['support-request'] });
    },
  });
}

export function useStaffCreateSupportRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: StaffCreateSupportRequestData) =>
      supportRequestsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support-requests'] });
      qc.invalidateQueries({ queryKey: ['support-calendar'] });
    },
  });
}

export function useCancelRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      supportRequestsApi.cancel(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support-requests'] });
      qc.invalidateQueries({ queryKey: ['support-request'] });
    },
  });
}

// Customer hooks
export function useCustomerSupportRequests() {
  return useQuery({
    queryKey: ['customer-support-requests'],
    queryFn: () => customerSupportApi.list(),
  });
}

export function useCustomerSupportDetail(id: number) {
  return useQuery({
    queryKey: ['customer-support-request', id],
    queryFn: () => customerSupportApi.detail(id),
  });
}

export function useCreateSupportRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupportRequestData) => customerSupportApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customer-support-requests'] }),
  });
}

export function useCustomerCancelRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => customerSupportApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-support-requests'] });
      qc.invalidateQueries({ queryKey: ['customer-support-request'] });
    },
  });
}

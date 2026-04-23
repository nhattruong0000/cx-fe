"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getAlerts, acknowledgeAlert } from "@/lib/api/inventory"
import type { AlertListParams } from "@/types/inventory"

export const ALERTS_QUERY_KEY = ["inventory", "alerts"] as const

export interface AlertsFilters {
  q: string
  /** CSV string or empty — matches API param */
  severity: string
  alert_type: string
  status: string
  branch_id: string
  page: number
  per_page: number
}

export const DEFAULT_FILTERS: AlertsFilters = {
  q: "",
  severity: "",
  alert_type: "",
  status: "open",
  branch_id: "",
  page: 1,
  per_page: 20,
}

/** Builds AlertListParams from UI filter state — omits empty strings */
function buildParams(filters: AlertsFilters): AlertListParams {
  const params: AlertListParams = {
    page: filters.page,
    per_page: filters.per_page,
  }
  if (filters.q) params.q = filters.q
  if (filters.severity) params.severity = filters.severity
  if (filters.alert_type) params.alert_type = filters.alert_type
  if (filters.status) params.status = filters.status
  if (filters.branch_id) params.branch_id = filters.branch_id
  return params
}

/**
 * TanStack Query hook for GET /api/v1/inventory/alerts.
 * Returns query data + filter state management + acknowledge mutation.
 */
export function useAlertsList() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = React.useState<AlertsFilters>(DEFAULT_FILTERS)
  const [debouncedQ, setDebouncedQ] = React.useState("")

  // Debounce search input 300ms
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(filters.q), 300)
    return () => clearTimeout(timer)
  }, [filters.q])

  const params = buildParams({ ...filters, q: debouncedQ })
  const queryKey = [...ALERTS_QUERY_KEY, params]

  const query = useQuery({
    queryKey,
    queryFn: () => getAlerts(params),
    staleTime: 30_000,
    retry: 2,
  })

  /** Update a single filter key and reset page to 1 */
  function setFilter<K extends keyof AlertsFilters>(key: K, value: AlertsFilters[K]) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? (value as number) : 1,
    }))
  }

  /** Acknowledge mutation with optimistic update */
  const acknowledgeMutation = useMutation({
    mutationFn: (id: string) => acknowledgeAlert(id),
    onMutate: async (id: string) => {
      // Snapshot queryKey at mutate time — filters may change before settle
      const snapshotKey = queryKey
      await queryClient.cancelQueries({ queryKey: snapshotKey })
      const prev = queryClient.getQueryData(snapshotKey)
      queryClient.setQueryData(snapshotKey, (old: typeof query.data) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((a) =>
            a.id === id
              ? { ...a, status: "acknowledged" as const, acknowledged_at: new Date().toISOString() }
              : a
          ),
        }
      })
      return { prev, snapshotKey }
    },
    onSuccess: () => {
      toast.success("Đã xác nhận cảnh báo")
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev && ctx.snapshotKey) queryClient.setQueryData(ctx.snapshotKey, ctx.prev)
      toast.error("Không thể xác nhận cảnh báo. Vui lòng thử lại.")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY })
    },
  })

  return {
    query,
    filters,
    setFilter,
    setFilters,
    acknowledge: acknowledgeMutation.mutate,
    isAcknowledging: acknowledgeMutation.isPending,
  }
}

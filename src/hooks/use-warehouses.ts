"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWarehouses } from "@/lib/api/inventory";

/**
 * Fetches warehouse options for the inventory filter dropdown.
 * Stable list — cached 10 min.
 */
export function useWarehouses() {
  return useQuery({
    queryKey: ["inventory", "warehouses"],
    queryFn: () => fetchWarehouses().then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });
}

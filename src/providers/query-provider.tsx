"use client";

import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            // Global 401 handler: logout on auth failure after refresh exhausted
            if ((error as { status?: number }).status === 401) {
              useAuthStore.getState().logout();
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error) => {
              // Don't retry 401 errors — auth refresh already attempted in client.ts
              if ((error as { status?: number }).status === 401) return false;
              return failureCount < 1;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

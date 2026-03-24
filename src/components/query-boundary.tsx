"use client";

import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface QueryBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  loadingFallback?: ReactNode;
  children: ReactNode;
}

export function QueryBoundary({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  emptyMessage = "Không có dữ liệu",
  loadingFallback,
  children,
}: QueryBoundaryProps) {
  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      )
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          {error?.message || "Đã xảy ra lỗi. Vui lòng thử lại."}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}

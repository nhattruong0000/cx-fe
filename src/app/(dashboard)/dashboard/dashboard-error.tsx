"use client";

import { CircleAlert, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardErrorProps {
  message?: string;
}

export function DashboardError({ message }: DashboardErrorProps) {
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <CircleAlert className="h-9 w-9 text-destructive" />
      </div>
      <p className="text-xl font-semibold text-foreground">
        {message ?? "Đã xảy ra lỗi"}
      </p>
      <p className="max-w-[360px] text-center text-sm text-muted-foreground">
        Không thể tải dữ liệu. Vui lòng thử lại sau.
      </p>
      <button
        type="button"
        className="mt-2 inline-flex items-center gap-2 rounded-[10px] border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
        onClick={() => queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] })}
      >
        <RefreshCw className="h-4 w-4" />
        Thử lại
      </button>
    </div>
  );
}

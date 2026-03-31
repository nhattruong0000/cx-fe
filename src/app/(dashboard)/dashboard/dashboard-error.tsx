"use client";

import { AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  message?: string;
}

export function DashboardError({ message }: DashboardErrorProps) {
  const queryClient = useQueryClient();

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <p className="text-lg font-medium text-muted-foreground">
        {message ?? "Failed to load dashboard"}
      </p>
      <Button
        variant="outline"
        onClick={() => queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] })}
      >
        Retry
      </Button>
    </div>
  );
}

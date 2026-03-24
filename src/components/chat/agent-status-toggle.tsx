"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AgentStatus = "online" | "busy" | "offline";

const statusConfig: Record<AgentStatus, { label: string; color: string }> = {
  online: { label: "Trực tuyến", color: "bg-green-500" },
  busy: { label: "Bận", color: "bg-yellow-500" },
  offline: { label: "Ngoại tuyến", color: "bg-neutral-400" },
};

export function AgentStatusToggle() {
  const [status, setStatus] = useState<AgentStatus>("online");
  const current = statusConfig[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
        <span className={cn("h-2.5 w-2.5 rounded-full", current.color)} />
        <span className="text-xs">{current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(statusConfig) as AgentStatus[]).map((key) => (
          <DropdownMenuItem key={key} onClick={() => setStatus(key)}>
            <span className={cn("mr-2 h-2.5 w-2.5 rounded-full", statusConfig[key].color)} />
            {statusConfig[key].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

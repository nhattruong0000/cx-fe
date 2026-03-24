"use client";

import type { Conversation, TicketStatus } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, UserPlus, CheckCircle, XCircle } from "lucide-react";

const statusLabels: Record<string, string> = {
  open: "Mở",
  assigned: "Đã giao",
  in_progress: "Đang xử lý",
  resolved: "Đã giải quyết",
  closed: "Đã đóng",
};

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  assigned: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-neutral-100 text-neutral-500",
};

interface ChatHeaderProps {
  conversation: Conversation;
  onStatusChange: (status: TicketStatus) => void;
}

export function ChatHeader({ conversation, onStatusChange }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{conversation.customerName}</h3>
          <Badge variant="secondary" className={statusColors[conversation.status]}>
            {statusLabels[conversation.status]}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground mt-0.5">{conversation.subject}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex shrink-0 items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
          Hành động <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onStatusChange("assigned")}>
            <UserPlus className="mr-2 h-4 w-4" /> Nhận xử lý
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("resolved")}>
            <CheckCircle className="mr-2 h-4 w-4" /> Đánh dấu đã giải quyết
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("closed")}>
            <XCircle className="mr-2 h-4 w-4" /> Đóng hội thoại
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

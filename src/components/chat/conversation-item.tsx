"use client";

import type { Conversation } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return "Vừa xong";
  if (diffH < 24) return `${diffH}h trước`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d trước`;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50",
        isActive && "bg-primary/5 border border-primary/20",
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {getInitials(conversation.customerName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">{conversation.customerName}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatTime(conversation.updatedAt)}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground mt-0.5">{conversation.subject}</p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="truncate text-xs text-muted-foreground/70">
            {conversation.lastMessage}
          </p>
          <Badge variant="secondary" className={cn("shrink-0 text-[10px] px-1.5 py-0", statusColors[conversation.status])}>
            {statusLabels[conversation.status]}
          </Badge>
        </div>
      </div>
    </button>
  );
}

"use client";

import type { Message } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatMessageTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAgent = message.senderType === "agent";
  const isBot = message.senderType === "bot";
  const sanitized = sanitizeHtml(message.content);

  return (
    <div className={cn("flex gap-2.5 max-w-[80%]", isAgent && "ml-auto flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-[10px] font-medium",
            isAgent && "bg-primary/10 text-primary",
            isBot && "bg-neutral-100 text-neutral-500",
            !isAgent && !isBot && "bg-accent/10 text-accent-foreground",
          )}
        >
          {isBot ? "Bot" : getInitials(message.senderName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className={cn("flex items-center gap-2 mb-1", isAgent && "flex-row-reverse")}>
          <span className="text-xs font-medium">{message.senderName}</span>
          <span className="text-[10px] text-muted-foreground">{formatMessageTime(message.createdAt)}</span>
        </div>
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isAgent ? "bg-primary text-primary-foreground" : "bg-muted",
            isBot && "bg-neutral-50 italic",
          )}
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      </div>
    </div>
  );
}

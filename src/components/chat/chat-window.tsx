"use client";

import { useEffect, useRef } from "react";
import type { Conversation } from "@/types/chat";
import { useMessages, useSendMessage, useUpdateTicket } from "@/hooks/use-chat";
import { QueryBoundary } from "@/components/query-boundary";
import { ChatHeader } from "./chat-header";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { MessageSquare } from "lucide-react";

interface ChatWindowProps {
  conversation: Conversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const { data: messages, isLoading, isError, error, refetch } = useMessages(conversation.id);
  const sendMessage = useSendMessage();
  const updateTicket = useUpdateTicket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        conversation={conversation}
        onStatusChange={(status) => updateTicket.mutate({ conversationId: conversation.id, status })}
      />
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          isEmpty={!messages?.length}
          emptyMessage="Chưa có tin nhắn"
        >
          {messages?.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </QueryBoundary>
      </div>
      <ChatInput
        onSend={(content) => sendMessage.mutate({ conversationId: conversation.id, content })}
        disabled={conversation.status === "closed"}
      />
    </div>
  );
}

export function ChatWindowEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
      <p className="text-sm">Chọn hội thoại để bắt đầu</p>
    </div>
  );
}

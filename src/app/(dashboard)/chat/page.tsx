"use client";

import { useState, useCallback } from "react";
import { useConversations } from "@/hooks/use-chat";
import { QueryBoundary } from "@/components/query-boundary";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow, ChatWindowEmpty } from "@/components/chat/chat-window";
import type { ConversationFilters } from "@/lib/api/chat";

export default function ChatPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ConversationFilters>({});
  const { data, isLoading, isError, error, refetch } = useConversations(filters);

  const conversations = data?.data ?? [];
  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const handleFilterChange = useCallback((f: { status?: string; search?: string }) => {
    setFilters({
      status: f.status === "all" ? undefined : (f.status as ConversationFilters["status"]),
      search: f.search || undefined,
    });
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-1/3 min-w-[300px] max-w-[400px]">
        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          isEmpty={false}
        >
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
            onFilterChange={handleFilterChange}
          />
        </QueryBoundary>
      </div>
      <div className="flex-1">
        {activeConversation ? (
          <ChatWindow conversation={activeConversation} />
        ) : (
          <ChatWindowEmpty />
        )}
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import { useConversations } from "@/hooks/use-chat";
import { QueryBoundary } from "@/components/query-boundary";
import { ChatWindow } from "@/components/chat/chat-window";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default function ConversationDetailPage({ params }: PageProps) {
  const { conversationId } = use(params);
  const { data, isLoading, isError, error, refetch } = useConversations();
  const conversation = data?.data.find((c) => c.id === conversationId);

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Link href="/chat">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-sm font-medium">Quay lại hộp thư</span>
      </div>
      <div className="flex-1">
        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          isEmpty={!conversation}
          emptyMessage="Không tìm thấy hội thoại"
        >
          {conversation && <ChatWindow conversation={conversation} />}
        </QueryBoundary>
      </div>
    </div>
  );
}

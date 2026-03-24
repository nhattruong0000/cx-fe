"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message } from "@/types/chat";
import {
  getConversations,
  getMessages,
  sendMessage,
  updateTicketStatus,
  getAgentList,
  type ConversationFilters,
} from "@/lib/api/chat";
import type { TicketStatus } from "@/types/chat";

export function useConversations(filters?: ConversationFilters) {
  return useQuery({
    queryKey: ["conversations", filters],
    queryFn: () => getConversations(filters),
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      sendMessage(conversationId, content),
    onMutate: async ({ conversationId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
      const previous = queryClient.getQueryData<Message[]>(["messages", conversationId]);
      const optimistic: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        senderId: "agt-001",
        senderName: "Nguyễn Thị Lan",
        senderType: "agent",
        content,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) => [...(old ?? []), optimistic]);
      return { previous };
    },
    onError: (_err, { conversationId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["messages", conversationId], context.previous);
      }
    },
    onSettled: (_data, _err, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, status }: { conversationId: string; status: TicketStatus }) =>
      updateTicketStatus(conversationId, status),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: getAgentList,
  });
}

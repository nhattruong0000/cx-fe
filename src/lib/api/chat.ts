import type { Conversation, Message, TicketStatus } from "@/types/chat";
import type { PaginatedResponse } from "@/types/common";
import { mockConversations, mockAgents } from "./mock-data/chat";

function delay(ms?: number): Promise<void> {
  const time = ms ?? Math.floor(Math.random() * 300) + 200;
  return new Promise((resolve) => setTimeout(resolve, time));
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, total: items.length, page, pageSize, totalPages: Math.ceil(items.length / pageSize) };
}

export interface ConversationFilters {
  status?: TicketStatus | "all";
  search?: string;
}

export async function getConversations(
  filters?: ConversationFilters,
  page = 1,
  pageSize = 20,
): Promise<PaginatedResponse<Conversation>> {
  await delay();
  let filtered = [...mockConversations];
  if (filters?.status && filters.status !== "all") {
    filtered = filtered.filter((c) => c.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q),
    );
  }
  return paginate(filtered, page, pageSize);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  await delay();
  const conv = mockConversations.find((c) => c.id === conversationId);
  return conv?.messages ?? [];
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  await delay(100);
  const newMsg: Message = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId: "agt-001",
    senderName: "Nguyễn Thị Lan",
    senderType: "agent",
    content,
    createdAt: new Date().toISOString(),
  };
  const conv = mockConversations.find((c) => c.id === conversationId);
  if (conv) {
    conv.messages.push(newMsg);
    conv.lastMessage = content;
    conv.updatedAt = newMsg.createdAt;
  }
  return newMsg;
}

export async function updateTicketStatus(conversationId: string, status: TicketStatus): Promise<Conversation> {
  await delay();
  const conv = mockConversations.find((c) => c.id === conversationId);
  if (!conv) throw new Error("Conversation not found");
  conv.status = status;
  conv.updatedAt = new Date().toISOString();
  return { ...conv };
}

export async function getAgentList() {
  await delay();
  return mockAgents;
}

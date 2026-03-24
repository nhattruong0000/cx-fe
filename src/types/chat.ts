export type TicketStatus = "open" | "assigned" | "in_progress" | "resolved" | "closed";

export type SenderType = "customer" | "agent" | "bot";

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "busy";
  activeChats: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: SenderType;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  agentId?: string;
  agentName?: string;
  status: TicketStatus;
  subject: string;
  lastMessage?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

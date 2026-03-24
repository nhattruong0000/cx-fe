export type JourneyEventType =
  | "page_view"
  | "add_to_cart"
  | "purchase"
  | "support_ticket"
  | "survey_response"
  | "loyalty_redeem"
  | "account_created"
  | "product_review";

export interface JourneyEvent {
  id: string;
  userId: string;
  customerName: string;
  type: JourneyEventType;
  description: string;
  metadata?: Record<string, string | number>;
  createdAt: string;
}

export interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
}

export interface JourneyStats {
  totalEvents: number;
  uniqueCustomers: number;
  avgEventsPerCustomer: number;
  topEventType: JourneyEventType;
  conversionRate: number;
}

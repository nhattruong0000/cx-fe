export type SupportStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface SupportRequest {
  id: number;
  issue_summary: string;
  description: string;
  status: SupportStatus;
  preferred_date: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  phone: string;
  contact_name: string;
  technician_name: string | null;
  organization_name: string;
  customer_name: string;
  created_at: string;
  completed_at: string | null;
}

export interface Activity {
  action: string;
  user_name: string;
  note: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SupportRequestDetail extends SupportRequest {
  internal_note: string | null;
  result_note: string | null;
  cancel_reason: string | null;
  activity_log: Activity[];
}

export interface CalendarEvent {
  id: number;
  organization_name: string;
  scheduled_date: string;
  scheduled_time: string | null;
  status: SupportStatus;
  technician_name: string | null;
}

export interface CreateSupportRequestData {
  issue_summary: string;
  description: string;
  preferred_date?: string;
  phone: string;
  contact_name: string;
}

export interface StaffCreateSupportRequestData {
  issue_summary: string;
  description: string;
  preferred_date?: string;
  phone: string;
  contact_name: string;
  organization_id: string;
}

export interface AssignRequestData {
  technician_id: number;
  scheduled_date: string;
  scheduled_time?: string;
  internal_note?: string;
}

export interface Technician {
  id: number;
  full_name: string;
  email: string;
}

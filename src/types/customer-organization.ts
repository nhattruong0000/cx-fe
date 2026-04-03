/** Types for customer organization management */

export interface CustomerOrganization {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  member_count: number;
}

export interface CustomerMembership {
  org_role: "owner" | "member";
  permissions: string[];
}

export interface MyOrganizationResponse {
  organization: CustomerOrganization;
  membership: CustomerMembership;
}

export interface OrgMember {
  user_id: number;
  full_name: string;
  email: string;
  org_role: "owner" | "member";
  permissions: string[];
  joined_at: string;
}

export interface OrgMembersPagination {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface OrgMembersResponse {
  members: OrgMember[];
  pagination: OrgMembersPagination;
}

export interface OrgMembersParams {
  page?: number;
  per_page?: number;
  q?: string;
}

export interface InviteMemberRequest {
  email: string;
  org_role: "owner" | "member";
  permissions: string[];
}

export interface UpdateMemberRequest {
  org_role?: "owner" | "member";
  permissions?: string[];
}

export interface OrgInvitation {
  id: number;
  email: string;
  org_role: "owner" | "member";
  created_at: string;
  expires_at: string;
}

export interface OrgInvitationsResponse {
  invitations: OrgInvitation[];
}

export const LEAD_STAGES = ["New", "Contacted", "Inquiry", "Viewing", "Negotiation", "Closed"] as const;
export const LEAD_STATUSES = ["Hot", "Warm", "Cold"] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Lead as returned by the API (camelCase, joined agent info included). */
export interface LeadDTO {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  propertyInterest: string | null;
  budget: string | null;
  preferredLocation: string | null;
  notes: string | null;
  stage: LeadStage;
  status: LeadStatus;
  source: string | null;
  avatarUrl: string | null;
  agentId: number | null;
  agentName: string | null;
  agentAvatar: string | null;
  hasFollowUp: boolean;
  createdAt: string;
  updatedAt: string;
}

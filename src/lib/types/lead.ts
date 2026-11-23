export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "ENROLLED"
  | "NOT_INTERESTED";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  secondaryPhone?: string | null;
  courseInterest?: string | null;
  consent: boolean;
  status: LeadStatus;
  internalNotes?: string;
  createdAt: string | number; // ISO string or timestamp
  updatedAt: string | number;
  createdBy: string;
}

export interface LeadStatusHistory {
  id: string;
  leadId: string;
  oldStatus: LeadStatus;
  newStatus: LeadStatus;
  changedBy: string; // admin username or UID
  changedAt: string | number;
}

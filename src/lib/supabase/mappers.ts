import { AuditLog } from "@/lib/types/audit";
import { Lead, LeadStatus, LeadStatusHistory } from "@/lib/types/lead";
import { UserProfile } from "@/lib/types/profile";

export function profileFromRow(row: any): UserProfile {
  return {
    uid: row.uid,
    username: row.username,
    normalizedUsername: row.normalized_username,
    role: row.role,
    status: row.status,
    mustChangePassword: row.must_change_password,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
  };
}

export function leadFromRow(row: any): Lead {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    primaryPhone: row.primary_phone,
    secondaryPhone: row.secondary_phone,
    courseInterest: row.course_interest,
    consent: row.consent,
    status: row.status as LeadStatus,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  };
}

export function auditFromRow(row: any): AuditLog {
  return {
    id: row.id,
    actorUid: row.actor_uid,
    actorRole: row.actor_role,
    actorUsername: row.actor_username,
    action: row.action,
    targetType: row.target_type,
    targetId: row.target_id,
    timestamp: row.timestamp,
    relevantMetadata: row.relevant_metadata,
  };
}

export function statusHistoryFromRow(row: any): LeadStatusHistory {
  return {
    id: row.id,
    leadId: row.lead_id,
    oldStatus: row.old_status,
    newStatus: row.new_status,
    changedBy: row.changed_by,
    changedAt: row.changed_at,
  };
}

export function auditToRow(log: Omit<AuditLog, "id">) {
  return {
    actor_uid: log.actorUid,
    actor_role: log.actorRole,
    actor_username: log.actorUsername,
    action: log.action,
    target_type: log.targetType,
    target_id: log.targetId,
    timestamp: log.timestamp,
    relevant_metadata: log.relevantMetadata ?? {},
  };
}
export function profileToRow(profile: UserProfile) {
  return {
    uid: profile.uid,
    username: profile.username,
    normalized_username: profile.normalizedUsername,
    role: profile.role,
    status: profile.status,
    must_change_password: profile.mustChangePassword,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
    last_login_at: profile.lastLoginAt ?? null,
  };
}

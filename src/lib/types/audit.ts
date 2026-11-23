import { UserRole } from "./profile";

export type AuditAction =
  | "CREATE_ADMIN"
  | "UPDATE_ADMIN"
  | "DELETE_ADMIN"
  | "FREEZE_ADMIN"
  | "UNFREEZE_ADMIN"
  | "RESET_PASSWORD"
  | "CHANGE_PASSWORD"
  | "UPDATE_LEAD_STATUS"
  | "UPDATE_LEAD_NOTES"
  | "SUPERADMIN_BOOTSTRAP";

export interface AuditLog {
  id: string;
  actorUid: string;
  actorRole: UserRole | "SYSTEM";
  actorUsername: string;
  action: AuditAction;
  targetType: "ADMIN" | "LEAD" | "SYSTEM";
  targetId: string;
  timestamp: string | number;
  relevantMetadata?: Record<string, any>;
}

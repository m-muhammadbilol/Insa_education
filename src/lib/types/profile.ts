export type UserRole = "ADMIN" | "SUPER_ADMIN";
export type AccountStatus = "ACTIVE" | "FROZEN";

export interface UserProfile {
  uid: string;
  username: string;
  normalizedUsername: string;
  role: UserRole;
  status: AccountStatus;
  mustChangePassword: boolean;
  createdAt: string | number;
  updatedAt: string | number;
  lastLoginAt?: string | number | null;
}

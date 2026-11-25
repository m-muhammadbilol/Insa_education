import { headers } from "next/headers";
import { getSupabaseAdmin } from "../supabase/admin";
import { profileFromRow } from "../supabase/mappers";
import { UserProfile, UserRole } from "../types/profile";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  profile: UserProfile;
}

/**
 * Verifies the Supabase access token from the Authorization header (Bearer token).
 * Validates that the account exists in the profiles table and is ACTIVE,
 * and matches the required role.
 */
export async function authenticateRequest(
  requiredRole?: UserRole
): Promise<AuthenticatedUser> {
  const headersList = headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED: Missing or invalid authorization header");
  }

  const accessToken = authHeader.slice("Bearer ".length);
  if (!accessToken) {
    throw new Error("UNAUTHORIZED: Token not provided");
  }

  const supabase = getSupabaseAdmin();
  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
  if (authError || !authData.user) {
    throw new Error("UNAUTHORIZED: Yaroqsiz yoki eskirgan sessiya");
  }

  const uid = authData.user.id;

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("uid", uid)
    .maybeSingle();
  if (profileError) throw new Error("PROFILE_LOOKUP_FAILED: Profilni tekshirib bo'lmadi");
  if (!profileRow) {
    throw new Error("PROFILE_NOT_FOUND: Foydalanuvchi profili topilmadi");
  }

  const profile = profileFromRow(profileRow);

  // Verify status is ACTIVE
  if (profile.status !== "ACTIVE") {
    throw new Error("ACCOUNT_FROZEN: Hisob vaqtincha muzlatilgan. Ma'muriyatga murojaat qiling.");
  }

  // Verify required role
  if (requiredRole) {
    if (requiredRole === "SUPER_ADMIN" && profile.role !== "SUPER_ADMIN") {
      throw new Error("FORBIDDEN: Ushbu amal uchun Super Admin ruxsati talab qilinadi");
    }
  }

  return {
    uid,
    email: authData.user.email,
    profile,
  };
}

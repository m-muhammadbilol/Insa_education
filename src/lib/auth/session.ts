import { headers } from "next/headers";
import { adminAuth, adminDb } from "../firebase/admin";
import { UserProfile, UserRole } from "../types/profile";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  profile: UserProfile;
}

/**
 * Extracts and verifies the Firebase ID token from the Authorization header (Bearer token).
 * Validates that the account exists in Firestore profiles collection, is ACTIVE,
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

  const idToken = authHeader.split("Bearer ")[1];
  if (!idToken) {
    throw new Error("UNAUTHORIZED: Token not provided");
  }

  // Check token with revocation check
  let decodedToken;
  try {
    decodedToken = await adminAuth().verifyIdToken(idToken, true);
  } catch (err: any) {
    if (err.code === "auth/id-token-revoked") {
      throw new Error("REVOKED: Sessiya bekor qilingan. Qaytadan tizimga kiring.");
    }
    throw new Error("UNAUTHORIZED: Yaroqsiz yoki eskirgan sessiya");
  }

  const uid = decodedToken.uid;

  // Retrieve user profile from Firestore
  const profileSnap = await adminDb().collection("profiles").doc(uid).get();
  if (!profileSnap.exists) {
    throw new Error("PROFILE_NOT_FOUND: Foydalanuvchi profili topilmadi");
  }

  const profile = profileSnap.data() as UserProfile;

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
    email: decodedToken.email,
    profile,
  };
}

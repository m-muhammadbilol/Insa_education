import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { usernameToInternalEmail, normalizeUsername } from "@/lib/auth/username-mapping";
import { createAdminSchema } from "@/lib/validations/auth";
import { UserProfile } from "@/lib/types/profile";

export const dynamic = "force-dynamic";

// GET /api/superadmin/admins: List all administrators
export async function GET() {
  try {
    await authenticateRequest("SUPER_ADMIN");

    const snapshot = await adminDb().collection("profiles").orderBy("createdAt", "desc").get();
    const admins: UserProfile[] = [];

    snapshot.forEach((doc: any) => {
      admins.push(doc.data() as UserProfile);
    });

    return NextResponse.json({
      success: true,
      admins,
    });
  } catch (error: any) {
    console.error("[Superadmin Admins GET API] Error:", error.message);
    const statusCode = error.message.startsWith("UNAUTHORIZED")
      ? 401
      : error.message.startsWith("FORBIDDEN") || error.message.startsWith("ACCOUNT_FROZEN")
      ? 403
      : 500;

    return NextResponse.json(
      { success: false, message: error.message },
      { status: statusCode }
    );
  }
}

// POST /api/superadmin/admins: Create a new administrator
export async function POST(req: NextRequest) {
  try {
    const { profile: actor } = await authenticateRequest("SUPER_ADMIN");
    const body = await req.json();

    const parsed = createAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: "Ma'lumotlar to'g'ri kiritilmadi",
        },
        { status: 400 }
      );
    }

    const { username, temporaryPassword } = parsed.data;
    const normalized = normalizeUsername(username);
    const internalEmail = usernameToInternalEmail(username);

    // Check if normalized username already exists in profiles
    const existing = await adminDb()
      .collection("profiles")
      .where("normalizedUsername", "==", normalized)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "Bunday foydalanuvchi nomi allaqachon mavjud",
        },
        { status: 409 }
      );
    }

    // 1. Create user in Firebase Authentication
    const userRecord = await adminAuth().createUser({
      email: internalEmail,
      password: temporaryPassword,
      displayName: username,
    });

    const nowIso = new Date().toISOString();

    // 2. Create profile in Firestore
    const newProfile: UserProfile = {
      uid: userRecord.uid,
      username: username.trim(),
      normalizedUsername: normalized,
      role: "ADMIN",
      status: "ACTIVE",
      mustChangePassword: true,
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: null,
    };

    await adminDb().collection("profiles").doc(userRecord.uid).set(newProfile);

    // 3. Log audit trail
    await adminDb().collection("audit_logs").add({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: "CREATE_ADMIN",
      targetType: "ADMIN",
      targetId: userRecord.uid,
      timestamp: nowIso,
      relevantMetadata: {
        createdUsername: username,
        assignedRole: "ADMIN",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Administrator muvaffaqiyatli yaratildi",
        admin: newProfile,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Superadmin Admins POST API] Error:", error.message);
    const statusCode = error.message.startsWith("UNAUTHORIZED")
      ? 401
      : error.message.startsWith("FORBIDDEN") || error.message.startsWith("ACCOUNT_FROZEN")
      ? 403
      : 500;

    return NextResponse.json(
      { success: false, message: error.message },
      { status: statusCode }
    );
  }
}

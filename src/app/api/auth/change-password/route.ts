import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { changePasswordSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user (any role whose token is valid and active)
    const { uid, profile } = await authenticateRequest();

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: "Parol talablarga javob bermaydi",
        },
        { status: 400 }
      );
    }

    const { newPassword } = parsed.data;
    const nowIso = new Date().toISOString();

    // 1. Update password in Firebase Authentication
    await adminAuth().updateUser(uid, {
      password: newPassword,
    });

    // 2. Clear mustChangePassword flag in Firestore
    await adminDb().collection("profiles").doc(uid).update({
      mustChangePassword: false,
      updatedAt: nowIso,
    });

    // 3. Record audit log
    await adminDb().collection("audit_logs").add({
      actorUid: uid,
      actorRole: profile.role,
      actorUsername: profile.username,
      action: "CHANGE_PASSWORD",
      targetType: "ADMIN",
      targetId: uid,
      timestamp: nowIso,
      relevantMetadata: {
        reason: "First login / user password change",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Parolingiz muvaffaqiyatli o'zgartirildi!",
    });
  } catch (error: any) {
    console.error("[Change Password API] Error:", error.message);
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

import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { profile: actor } = await authenticateRequest("SUPER_ADMIN");
    const targetUid = params.uid;

    const body = await req.json();
    const temporaryPassword = body.temporaryPassword;

    if (!temporaryPassword || typeof temporaryPassword !== "string" || temporaryPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "Vaqtinchalik parol kamida 8 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    const profileRef = adminDb().collection("profiles").doc(targetUid);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Administrator topilmadi" },
        { status: 404 }
      );
    }

    const targetProfile = profileDoc.data();
    const nowIso = new Date().toISOString();

    // 1. Update password in Firebase Auth
    await adminAuth().updateUser(targetUid, {
      password: temporaryPassword,
    });

    // 2. Revoke current tokens so they must log in with the new temporary password
    await adminAuth().revokeRefreshTokens(targetUid);

    // 3. Mark mustChangePassword = true in profile
    await profileRef.update({
      mustChangePassword: true,
      updatedAt: nowIso,
    });

    // 4. Record audit log
    await adminDb().collection("audit_logs").add({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: "RESET_PASSWORD",
      targetType: "ADMIN",
      targetId: targetUid,
      timestamp: nowIso,
      relevantMetadata: {
        targetUsername: targetProfile?.username,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vaqtinchalik parol muvaffaqiyatli o'rnatildi",
    });
  } catch (error: any) {
    console.error("[Superadmin Reset Password API] Error:", error.message);
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

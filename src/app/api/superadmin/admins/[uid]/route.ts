import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { profile: actor } = await authenticateRequest("SUPER_ADMIN");
    const targetUid = params.uid;

    if (actor.uid === targetUid) {
      return NextResponse.json(
        { success: false, message: "O'z hisobingizni o'chira olmaysiz" },
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
    if (targetProfile?.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Super Admin hisobini o'chirib bo'lmaydi" },
        { status: 403 }
      );
    }

    const nowIso = new Date().toISOString();

    // 1. Delete user from Firebase Auth (revokes all access immediately)
    try {
      await adminAuth().deleteUser(targetUid);
    } catch (authErr: any) {
      console.warn("[Delete Admin] Auth user deletion warning:", authErr.message);
    }

    // 2. Delete profile from Firestore
    await profileRef.delete();

    // 3. Record audit log
    await adminDb().collection("audit_logs").add({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: "DELETE_ADMIN",
      targetType: "ADMIN",
      targetId: targetUid,
      timestamp: nowIso,
      relevantMetadata: {
        deletedUsername: targetProfile?.username,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Administrator hisobi butunlay o'chirildi",
    });
  } catch (error: any) {
    console.error("[Superadmin Delete Admin API] Error:", error.message);
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

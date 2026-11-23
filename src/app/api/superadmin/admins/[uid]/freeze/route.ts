import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { AccountStatus } from "@/lib/types/profile";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { profile: actor } = await authenticateRequest("SUPER_ADMIN");
    const targetUid = params.uid;

    if (actor.uid === targetUid) {
      return NextResponse.json(
        { success: false, message: "O'z hisobingizni muzlatishingiz mumkin emas" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const actionType: "FREEZE" | "UNFREEZE" = body.action;

    if (actionType !== "FREEZE" && actionType !== "UNFREEZE") {
      return NextResponse.json(
        { success: false, message: "Noto'g'ri amal turi" },
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
        { success: false, message: "Super Admin hisobini muzlatib bo'lmaydi" },
        { status: 403 }
      );
    }

    const newStatus: AccountStatus = actionType === "FREEZE" ? "FROZEN" : "ACTIVE";
    const nowIso = new Date().toISOString();

    // 1. Update status in Firestore
    await profileRef.update({
      status: newStatus,
      updatedAt: nowIso,
    });

    // 2. If FREEZING, immediately revoke Firebase Auth refresh tokens!
    if (actionType === "FREEZE") {
      await adminAuth().revokeRefreshTokens(targetUid);
      // Also disable the account in Firebase Auth
      await adminAuth().updateUser(targetUid, { disabled: true });
    } else {
      // Re-enable in Firebase Auth
      await adminAuth().updateUser(targetUid, { disabled: false });
    }

    // 3. Record audit log
    await adminDb().collection("audit_logs").add({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: actionType === "FREEZE" ? "FREEZE_ADMIN" : "UNFREEZE_ADMIN",
      targetType: "ADMIN",
      targetId: targetUid,
      timestamp: nowIso,
      relevantMetadata: {
        targetUsername: targetProfile?.username,
        newStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        actionType === "FREEZE"
          ? "Administrator hisobi muvaffaqiyatli muzlatildi va sessiyalari bekor qilindi"
          : "Administrator hisobi muvaffaqiyatli faollashtirildi",
      status: newStatus,
    });
  } catch (error: any) {
    console.error("[Superadmin Freeze API] Error:", error.message);
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

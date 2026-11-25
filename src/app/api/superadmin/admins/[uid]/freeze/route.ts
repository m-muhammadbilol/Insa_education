import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow, profileFromRow } from "@/lib/supabase/mappers";
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

    const supabase = getSupabaseAdmin();
    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("uid", targetUid)
      .maybeSingle();
    if (profileError) throw profileError;

    if (!profileRow) {
      return NextResponse.json(
        { success: false, message: "Administrator topilmadi" },
        { status: 404 }
      );
    }

    const targetProfile = profileFromRow(profileRow);
    if (targetProfile.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Super Admin hisobini muzlatib bo'lmaydi" },
        { status: 403 }
      );
    }

    const newStatus: AccountStatus = actionType === "FREEZE" ? "FROZEN" : "ACTIVE";
    const nowIso = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ status: newStatus, updated_at: nowIso })
      .eq("uid", targetUid);
    if (updateError) throw updateError;
    if (actionType === "FREEZE") {
      const { error: signOutError } = await supabase.auth.admin.signOut(targetUid, "global");
      if (signOutError) throw signOutError;
    }

    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: actionType === "FREEZE" ? "FREEZE_ADMIN" : "UNFREEZE_ADMIN",
      targetType: "ADMIN",
      targetId: targetUid,
      timestamp: nowIso,
      relevantMetadata: {
        targetUsername: targetProfile.username,
        newStatus,
      },
    }));
    if (auditError) throw auditError;

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

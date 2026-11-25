import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow, profileFromRow } from "@/lib/supabase/mappers";

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
        { success: false, message: "Super Admin hisobini o'chirib bo'lmaydi" },
        { status: 403 }
      );
    }

    const nowIso = new Date().toISOString();

    const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUid);
    if (deleteError) throw deleteError;

    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: "DELETE_ADMIN",
      targetType: "ADMIN",
      targetId: targetUid,
      timestamp: nowIso,
      relevantMetadata: {
        deletedUsername: targetProfile.username,
      },
    }));
    if (auditError) throw auditError;

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

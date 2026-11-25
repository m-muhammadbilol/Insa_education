import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow, profileFromRow } from "@/lib/supabase/mappers";

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
    const nowIso = new Date().toISOString();

    const { error: passwordError } = await supabase.auth.admin.updateUserById(targetUid, {
      password: temporaryPassword,
    });
    if (passwordError) throw passwordError;

    const { error: signOutError } = await supabase.auth.admin.signOut(targetUid, "global");
    if (signOutError) throw signOutError;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ must_change_password: true, updated_at: nowIso })
      .eq("uid", targetUid);
    if (updateError) throw updateError;

    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: "RESET_PASSWORD",
      targetType: "ADMIN",
      targetId: targetUid,
      timestamp: nowIso,
      relevantMetadata: {
        targetUsername: targetProfile.username,
      },
    }));
    if (auditError) throw auditError;

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

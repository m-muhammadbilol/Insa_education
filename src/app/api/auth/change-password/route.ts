import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow } from "@/lib/supabase/mappers";
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

    const supabase = getSupabaseAdmin();
    const { error: passwordError } = await supabase.auth.admin.updateUserById(uid, {
      password: newPassword,
    });
    if (passwordError) throw passwordError;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ must_change_password: false, updated_at: nowIso })
      .eq("uid", uid);
    if (profileError) throw profileError;

    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
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
    }));
    if (auditError) throw auditError;

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

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authenticateRequest } from "@/lib/auth/session";
import { normalizeUsername, usernameToInternalEmail } from "@/lib/auth/username-mapping";
import { changeUsernameSchema } from "@/lib/validations/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow } from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const { uid, email, profile: actor } = await authenticateRequest("SUPER_ADMIN");
    const parsed = changeUsernameSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: "Username yoki hozirgi parolni tekshiring.",
        },
        { status: 400 }
      );
    }

    const { username, currentPassword } = parsed.data;
    const normalized = normalizeUsername(username);
    if (normalized === actor.normalizedUsername) {
      return NextResponse.json({ success: true, message: "Username o'zgarmadi.", username: actor.username });
    }
    if (!email) throw new Error("AUTH_EMAIL_MISSING");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) throw new Error("SUPABASE_PUBLIC_CONFIG_MISSING");

    const verifier = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error: verifyError } = await verifier.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (verifyError) {
      return NextResponse.json(
        { success: false, message: "Hozirgi parol noto'g'ri." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: duplicate, error: duplicateError } = await supabase
      .from("profiles")
      .select("uid")
      .eq("normalized_username", normalized)
      .neq("uid", uid)
      .maybeSingle();
    if (duplicateError) throw duplicateError;
    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Bu username band. Boshqasini tanlang." },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const nextEmail = usernameToInternalEmail(username);
    const oldMetadata = { username: actor.username };
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(uid, {
      email: nextEmail,
      email_confirm: true,
      user_metadata: { ...oldMetadata, username },
    });
    if (authUpdateError) throw authUpdateError;

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ username, normalized_username: normalized, updated_at: now })
      .eq("uid", uid);
    if (profileUpdateError) {
      await supabase.auth.admin.updateUserById(uid, {
        email,
        email_confirm: true,
        user_metadata: oldMetadata,
      });
      throw profileUpdateError;
    }

    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
      actorUid: uid,
      actorRole: actor.role,
      actorUsername: username,
      action: "CHANGE_USERNAME",
      targetType: "ADMIN",
      targetId: uid,
      timestamp: now,
      relevantMetadata: { previousUsername: actor.username, newUsername: username },
    }));
    if (auditError) {
      await supabase.from("profiles").update({
        username: actor.username,
        normalized_username: actor.normalizedUsername,
        updated_at: now,
      }).eq("uid", uid);
      await supabase.auth.admin.updateUserById(uid, {
        email,
        email_confirm: true,
        user_metadata: oldMetadata,
      });
      throw auditError;
    }

    return NextResponse.json({
      success: true,
      message: "Username muvaffaqiyatli o'zgartirildi.",
      username,
    });
  } catch (error: any) {
    console.error("[Superadmin Username API] Error:", error.message);
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

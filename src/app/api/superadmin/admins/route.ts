import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow, profileFromRow, profileToRow } from "@/lib/supabase/mappers";
import { usernameToInternalEmail, normalizeUsername } from "@/lib/auth/username-mapping";
import { createAdminSchema } from "@/lib/validations/auth";
import { UserProfile } from "@/lib/types/profile";

export const dynamic = "force-dynamic";

// GET /api/superadmin/admins: List all administrators
export async function GET() {
  try {
    await authenticateRequest("SUPER_ADMIN");

    const { data, error } = await getSupabaseAdmin()
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const admins: UserProfile[] = (data || []).map(profileFromRow);

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
    const supabase = getSupabaseAdmin();
    const { data: existing, error: lookupError } = await supabase
      .from("profiles")
      .select("uid")
      .eq("normalized_username", normalized)
      .maybeSingle();
    if (lookupError) throw lookupError;

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Bunday foydalanuvchi nomi allaqachon mavjud",
        },
        { status: 409 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: internalEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { username },
    });
    if (authError || !authData.user) throw authError || new Error("User creation failed");

    const nowIso = new Date().toISOString();

    // 2. Create the Supabase profile row
    const newProfile: UserProfile = {
      uid: authData.user.id,
      username: username.trim(),
      normalizedUsername: normalized,
      role: "ADMIN",
      status: "ACTIVE",
      mustChangePassword: true,
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: null,
    };

    const { error: profileError } = await supabase.from("profiles").insert(profileToRow(newProfile));
    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: "CREATE_ADMIN",
      targetType: "ADMIN",
      targetId: authData.user.id,
      timestamp: nowIso,
      relevantMetadata: {
        createdUsername: username,
        assignedRole: "ADMIN",
      },
    }));
    if (auditError) throw auditError;

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

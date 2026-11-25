import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow } from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";
const CONFIRM_PHRASE = "BARCHA ARIZALARNI O'CHIRISH";

export async function DELETE(req: NextRequest) {
  try {
    const { profile: actor } = await authenticateRequest("SUPER_ADMIN");
    const body = await req.json();
    if (body?.confirmPhrase !== CONFIRM_PHRASE) {
      return NextResponse.json({ success: false, message: `Tasdiqlash uchun aynan: ${CONFIRM_PHRASE}` }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { count, error: countError } = await supabase.from("leads").select("id", { count: "exact", head: true });
    if (countError) throw countError;
    if (!count) return NextResponse.json({ success: true, deleted: 0, message: "O'chiriladigan ariza yo'q." });

    const timestamp = new Date().toISOString();
    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: "DELETE_ALL_LEADS",
      targetType: "SYSTEM",
      targetId: "ALL_LEADS",
      timestamp,
      relevantMetadata: { requestedCount: count, confirmation: "typed phrase" },
    }));
    if (auditError) throw auditError;

    const { count: deleted, error: deleteError } = await supabase.from("leads").delete({ count: "exact" }).not("id", "is", null);
    if (deleteError) throw deleteError;
    return NextResponse.json({ success: true, deleted: deleted ?? 0, message: "Arizalar tozalandi." });
  } catch (error: any) {
    console.error("[Superadmin clear leads] Error:", error.message);
    const status = String(error?.message || "").startsWith("UNAUTHORIZED") ? 401 : String(error?.message || "").startsWith("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, message: status === 401 || status === 403 ? error.message : "Arizalarni tozalashda xatolik yuz berdi." }, { status });
  }
}

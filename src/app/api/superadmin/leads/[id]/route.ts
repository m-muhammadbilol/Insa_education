import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow } from "@/lib/supabase/mappers";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { profile: actor } = await authenticateRequest("SUPER_ADMIN");
    const leadId = params.id;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(leadId)) {
      return NextResponse.json({ success: false, message: "Ariza identifikatori noto'g'ri." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: deleted, error } = await supabase.from("leads").delete().eq("id", leadId).select("id").maybeSingle();
    if (error) throw error;
    if (!deleted) return NextResponse.json({ success: false, message: "Ariza topilmadi." }, { status: 404 });

    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
      actorUid: actor.uid,
      actorRole: actor.role,
      actorUsername: actor.username,
      action: "DELETE_LEAD",
      targetType: "LEAD",
      targetId: leadId,
      timestamp: new Date().toISOString(),
      relevantMetadata: { operation: "single lead deletion" },
    }));
    if (auditError) console.error("[Superadmin delete lead] Audit insert failed:", auditError.message);

    return NextResponse.json({ success: true, message: "Ariza o'chirildi." });
  } catch (error: any) {
    console.error("[Superadmin delete lead] Error:", error.message);
    const status = String(error?.message || "").startsWith("UNAUTHORIZED") ? 401 : String(error?.message || "").startsWith("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, message: status === 401 || status === 403 ? error.message : "Arizani o'chirishda xatolik yuz berdi." }, { status });
  }
}

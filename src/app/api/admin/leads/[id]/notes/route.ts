import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditToRow } from "@/lib/supabase/mappers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { profile } = await authenticateRequest();
    const leadId = params.id;
    const body = await req.json();
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    const supabase = getSupabaseAdmin();
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id")
      .eq("id", leadId)
      .maybeSingle();
    if (leadError) throw leadError;

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead topilmadi" },
        { status: 404 }
      );
    }

    const nowIso = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("leads")
      .update({ internal_notes: notes, updated_at: nowIso })
      .eq("id", leadId);
    if (updateError) throw updateError;

    const { error: auditError } = await supabase.from("audit_logs").insert(auditToRow({
      actorUid: profile.uid,
      actorRole: profile.role,
      actorUsername: profile.username,
      action: "UPDATE_LEAD_NOTES",
      targetType: "LEAD",
      targetId: leadId,
      timestamp: nowIso,
      relevantMetadata: { notesLength: notes.length },
    }));
    if (auditError) throw auditError;

    return NextResponse.json({
      success: true,
      message: "Izoh muvaffaqiyatli saqlandi",
      notes,
    });
  } catch (error: any) {
    console.error("[Lead Notes API] Error:", error.message);
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

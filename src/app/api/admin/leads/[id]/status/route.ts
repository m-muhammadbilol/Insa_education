import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { LeadStatus } from "@/lib/types/lead";

const validStatuses: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "ENROLLED",
  "NOT_INTERESTED",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { profile } = await authenticateRequest();
    const leadId = params.id;
    const body = await req.json();
    const newStatus = body.status as LeadStatus;

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, message: "Noto'g'ri lead holati" },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabaseAdmin().rpc("update_lead_status", {
      p_lead_id: leadId,
      p_new_status: newStatus,
      p_changed_by: profile.username,
      p_actor_uid: profile.uid,
      p_actor_role: profile.role,
      p_actor_username: profile.username,
    });
    if (error) {
      if (error.message.includes("LEAD_NOT_FOUND")) {
        return NextResponse.json({ success: false, message: "Lead topilmadi" }, { status: 404 });
      }
      throw error;
    }
    const result = Array.isArray(data) ? data[0] : data;
    const oldStatus = result?.old_status || "NEW";

    return NextResponse.json({
      success: true,
      message: "Lead holati yangilandi",
      oldStatus,
      newStatus,
    });
  } catch (error: any) {
    console.error("[Lead Status API] Error:", error.message);
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

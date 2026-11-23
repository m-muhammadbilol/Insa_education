import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { profile } = await authenticateRequest();
    const leadId = params.id;
    const body = await req.json();
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    const leadRef = adminDb().collection("leads").doc(leadId);
    const leadDoc = await leadRef.get();

    if (!leadDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Lead topilmadi" },
        { status: 404 }
      );
    }

    const nowIso = new Date().toISOString();

    await leadRef.update({
      internalNotes: notes,
      updatedAt: nowIso,
    });

    // Record audit log
    await adminDb().collection("audit_logs").add({
      actorUid: profile.uid,
      actorRole: profile.role,
      actorUsername: profile.username,
      action: "UPDATE_LEAD_NOTES",
      targetType: "LEAD",
      targetId: leadId,
      timestamp: nowIso,
      relevantMetadata: { notesLength: notes.length },
    });

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

import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
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

    const leadRef = adminDb().collection("leads").doc(leadId);
    const leadDoc = await leadRef.get();

    if (!leadDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Lead topilmadi" },
        { status: 404 }
      );
    }

    const leadData = leadDoc.data();
    const oldStatus = leadData?.status || "NEW";
    const nowIso = new Date().toISOString();

    // Batch or transaction for atomic status update and history recording
    const batch = adminDb().batch();

    // 1. Update lead document
    batch.update(leadRef, {
      status: newStatus,
      updatedAt: nowIso,
    });

    // 2. Append to lead_status_history
    const historyRef = adminDb().collection("lead_status_history").doc();
    batch.set(historyRef, {
      id: historyRef.id,
      leadId,
      oldStatus,
      newStatus,
      changedBy: profile.username,
      changedAt: nowIso,
    });

    // 3. Append to audit_logs
    const auditRef = adminDb().collection("audit_logs").doc();
    batch.set(auditRef, {
      id: auditRef.id,
      actorUid: profile.uid,
      actorRole: profile.role,
      actorUsername: profile.username,
      action: "UPDATE_LEAD_STATUS",
      targetType: "LEAD",
      targetId: leadId,
      timestamp: nowIso,
      relevantMetadata: {
        oldStatus,
        newStatus,
      },
    });

    await batch.commit();

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

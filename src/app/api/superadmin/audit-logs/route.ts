import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { AuditLog } from "@/lib/types/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await authenticateRequest("SUPER_ADMIN");

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const snapshot = await adminDb()
      .collection("audit_logs")
      .orderBy("timestamp", "desc")
      .limit(Math.min(limit, 200))
      .get();

    const logs: AuditLog[] = [];
    snapshot.forEach((doc: any) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
      } as AuditLog);
    });

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error: any) {
    console.error("[Audit Logs API] Error:", error.message);
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

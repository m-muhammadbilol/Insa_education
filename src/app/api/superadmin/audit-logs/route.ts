import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { auditFromRow } from "@/lib/supabase/mappers";
import { AuditLog } from "@/lib/types/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await authenticateRequest("SUPER_ADMIN");

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const { data, error } = await getSupabaseAdmin()
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 200));
    if (error) throw error;
    const logs: AuditLog[] = (data || []).map(auditFromRow);

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

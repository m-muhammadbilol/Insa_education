import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { leadFromRow } from "@/lib/supabase/mappers";
import { Lead } from "@/lib/types/lead";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Both ADMIN and SUPER_ADMIN can view leads
    const { profile } = await authenticateRequest();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let query = getSupabaseAdmin()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 100));

    if (status && status !== "ALL") query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    let leads: Lead[] = (data || []).map(leadFromRow);

    // In-memory text search filtering if search term provided
    if (search) {
      leads = leads.filter(
        (lead) =>
          lead.firstName.toLowerCase().includes(search) ||
          lead.lastName.toLowerCase().includes(search) ||
          lead.primaryPhone.includes(search) ||
          (lead.secondaryPhone && lead.secondaryPhone.includes(search)) ||
          (lead.courseInterest && lead.courseInterest.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      leads,
      count: leads.length,
    });
  } catch (error: any) {
    console.error("[Admin Leads API] Error:", error.message);
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

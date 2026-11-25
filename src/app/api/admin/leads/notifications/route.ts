import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await authenticateRequest();
    const { count, error } = await getSupabaseAdmin()
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "NEW");
    if (error) throw error;
    return NextResponse.json({ success: true, count: count ?? 0 });
  } catch (error: any) {
    const status = String(error?.message || "").startsWith("UNAUTHORIZED") ? 401 : 403;
    return NextResponse.json({ success: false, message: "Yangi arizalar sonini olib bo'lmadi." }, { status });
  }
}

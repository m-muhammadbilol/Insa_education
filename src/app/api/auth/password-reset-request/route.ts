import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeUsername } from "@/lib/auth/username-mapping";
import { usernameSchema } from "@/lib/validations/auth";
import { sendPasswordResetRequestNotification } from "@/lib/services/telegram";

export const dynamic = "force-dynamic";

const recentRequests = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = usernameSchema.safeParse(body?.username);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Username'ni to'g'ri kiriting." }, { status: 400 });
    }

    const ip = (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-forwarded-for") || "unknown")
      .split(",")[0].trim().slice(0, 64);
    const now = Date.now();
    if ((recentRequests.get(ip) ?? 0) > now - 60_000) {
      return NextResponse.json({ success: true, message: "So'rov qabul qilindi. Telegram xabari sozlangan bo'lsa Super Admin'ga boradi; aks holda unga bevosita murojaat qiling." });
    }
    recentRequests.set(ip, now);
    if (recentRequests.size > 10000) {
      recentRequests.forEach((timestamp, key) => {
        if (timestamp <= now - 60_000) recentRequests.delete(key);
      });
    }

    const normalized = normalizeUsername(parsed.data);
    const { data: profile, error } = await getSupabaseAdmin()
      .from("profiles")
      .select("username")
      .eq("normalized_username", normalized)
      .eq("role", "ADMIN")
      .eq("status", "ACTIVE")
      .maybeSingle();
    if (error) throw error;

    if (profile) await sendPasswordResetRequestNotification(profile.username);

    return NextResponse.json({
      success: true,
      message: "So'rov qabul qilindi. Telegram xabari sozlangan bo'lsa Super Admin'ga boradi; aks holda unga bevosita murojaat qiling.",
    });
  } catch (error) {
    console.error("[Password reset request] Failed:", error);
    return NextResponse.json({ success: false, message: "So'rov yuborilmadi. Keyinroq qayta urinib ko'ring." }, { status: 500 });
  }
}

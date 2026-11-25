import { NextRequest, NextResponse } from "next/server";
import { leadSchema, cleanPhoneNumber } from "@/lib/validations/lead";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendLeadTelegramNotification } from "@/lib/services/telegram";
import { Lead } from "@/lib/types/lead";

export const dynamic = "force-dynamic";

// Best-effort per-instance rate limiting; use a shared store for strict limits
// across serverless instances.
const submissionTimestamps = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-forwarded-for") || "unknown-ip")
      .split(",")[0]
      .trim()
      .slice(0, 64);
    const body = await req.json();

    // 1. Server-side validation
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: "Ma'lumotlar to'liq yoki to'g'ri kiritilmadi",
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, primaryPhone, secondaryPhone, courseInterest, consent } =
      parsed.data;
    const cleanedPrimary = cleanPhoneNumber(primaryPhone);
    const cleanedSecondary = secondaryPhone ? cleanPhoneNumber(secondaryPhone) : null;

    // Rate limit duplicate submissions by both client address and phone.
    const rateKey = `${ip}_${cleanedPrimary}`;
    const lastSub = submissionTimestamps.get(rateKey);
    const now = Date.now();
    if (lastSub && now - lastSub < 15000) {
      return NextResponse.json(
        {
          success: false,
          message: "Iltimos, qayta yuborishdan oldin 15 soniya kuting.",
        },
        { status: 429 }
      );
    }
    submissionTimestamps.set(rateKey, now);
    if (submissionTimestamps.size > 5000) {
      submissionTimestamps.forEach((timestamp, key) => {
        if (now - timestamp > 15 * 60 * 1000) submissionTimestamps.delete(key);
      });
      while (submissionTimestamps.size > 5000) {
        const oldestKey = submissionTimestamps.keys().next().value;
        if (!oldestKey) break;
        submissionTimestamps.delete(oldestKey);
      }
    }

    const nowIso = new Date().toISOString();

    const leadRow = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      primary_phone: cleanedPrimary,
      secondary_phone: cleanedSecondary,
      course_interest: courseInterest ? courseInterest.trim() : null,
      consent: true,
      status: "NEW",
      internal_notes: "",
      created_at: nowIso,
      updated_at: nowIso,
      created_by: "public",
    };

    const { data: insertedLead, error: insertError } = await getSupabaseAdmin()
      .from("leads")
      .insert(leadRow)
      .select("id")
      .single();
    if (insertError || !insertedLead) throw insertError || new Error("Lead insert failed");
    const leadId = insertedLead.id;
    const newLead: Lead = {
      id: leadId,
      firstName: leadRow.first_name,
      lastName: leadRow.last_name,
      primaryPhone: leadRow.primary_phone,
      secondaryPhone: leadRow.secondary_phone,
      courseInterest: leadRow.course_interest,
      consent: true,
      status: "NEW",
      internalNotes: "",
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: "public",
    };

    // 4. Trigger Telegram Notification (Separate Operation - failsafe)
    // Runs without blocking/failing the response
    const submissionTime = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
    });

    sendLeadTelegramNotification({
      firstName: newLead.firstName,
      lastName: newLead.lastName,
      primaryPhone: newLead.primaryPhone,
      secondaryPhone: newLead.secondaryPhone,
      courseInterest: newLead.courseInterest,
      timestamp: submissionTime,
    }).catch((tgErr) => {
      console.error("[Lead API] Telegram alert background error:", tgErr);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Arizangiz muvaffaqiyatli qabul qilindi! Tez orada mutaxassisimiz siz bilan bog'lanadi.",
        leadId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Lead API] Error processing lead submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Arizani qabul qilishda texnik xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { leadSchema, cleanPhoneNumber } from "@/lib/validations/lead";
import { adminDb } from "@/lib/firebase/admin";
import { sendLeadTelegramNotification } from "@/lib/services/telegram";
import { Lead } from "@/lib/types/lead";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiting map for basic protection
const submissionTimestamps = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
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

    // Rate limiting: max 1 submission per 15 seconds per IP or phone
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

    // 2. Prepare Lead document
    const leadsCollection = adminDb().collection("leads");
    const leadRef = leadsCollection.doc();
    const leadId = leadRef.id;
    const nowIso = new Date().toISOString();

    const newLead: Lead = {
      id: leadId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      primaryPhone: cleanedPrimary,
      secondaryPhone: cleanedSecondary,
      courseInterest: courseInterest ? courseInterest.trim() : null,
      consent: true,
      status: "NEW",
      internalNotes: "",
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: "public",
    };

    // 3. Save to Firestore (Primary Operation)
    await leadRef.set(newLead);

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

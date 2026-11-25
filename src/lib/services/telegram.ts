/**
 * Telegram notification service for new lead alerts.
 * Designed to be completely failsafe: if Telegram API is unreachable or fails,
 * the lead remains safely committed to Supabase PostgreSQL.
 */

interface SendLeadNotificationParams {
  firstName: string;
  lastName: string;
  primaryPhone: string;
  secondaryPhone?: string | null;
  courseInterest?: string | null;
  timestamp: string;
}

export async function sendLeadTelegramNotification(
  params: SendLeadNotificationParams
): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[Telegram] Notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured."
    );
    return { success: false, error: "Telegram credentials not configured" };
  }

  const courseInfo = params.courseInterest
    ? `\n📚 <b>Qiziqqan kursi:</b> ${escapeHtml(params.courseInterest)}`
    : "";
  const secPhone = params.secondaryPhone
    ? `\n📞 <b>Qo'shimcha tel:</b> <code>${escapeHtml(params.secondaryPhone)}</code>`
    : "";

  const message = [
    `⚡️ <b>YANGI ARIZA (LEAD) — INSA EDUCATION</b>`,
    ``,
    `👤 <b>F.I.O:</b> ${escapeHtml(params.firstName)} ${escapeHtml(params.lastName)}`,
    `📱 <b>Asosiy tel:</b> <code>${escapeHtml(params.primaryPhone)}</code>${secPhone}${courseInfo}`,
    `🕒 <b>Vaqt:</b> ${escapeHtml(params.timestamp)}`,
    ``,
    `📍 <i>INSA Education CRM tizimiga kiritildi</i>`,
  ].join("\n");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Telegram] API error:", response.status, errText);
      return { success: false, error: `Telegram error: ${response.status}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Telegram] Network or delivery failure:", err.message);
    return { success: false, error: err.message };
  }
}

/** Notify the configured admin chat that an account requested a password reset. Never include passwords. */
export async function sendPasswordResetRequestNotification(username: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return false;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔐 INSA CRM: <b>${escapeHtml(username)}</b> parolni tiklashni so'radi. Adminlar boshqaruvida vaqtinchalik parol o'rnating. Parolni Telegram orqali yubormang.`,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch (error) {
    console.error("[Telegram] Password reset alert failed:", error);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

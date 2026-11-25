import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

// Placeholder values keep the app renderable before Vercel environment variables
// are added. Auth/data operations must still check `supabaseConfigured` first.
export const supabase = createClient(
  url || "https://missing.supabase.co",
  anonKey || "missing-supabase-anon-key",
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);

function isWellFormedJwt(token: string | null | undefined): token is string {
  if (!token) return false;
  const segments = token.split(".");
  return segments.length === 3 && segments.every((segment) => /^[A-Za-z0-9_-]+$/.test(segment));
}

async function refreshValidSession() {
  const { data, error } = await supabase.auth.refreshSession();
  const token = data.session?.access_token;
  if (error || !isWellFormedJwt(token)) {
    await supabase.auth.signOut();
    throw new Error("Sessiya yaroqsiz yoki eskirgan. Qaytadan tizimga kiring.");
  }
  return token;
}

export async function getAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  let session = data.session;
  if (!session) return null;

  // Refresh shortly before expiry so mobile pages do not race an expired token.
  if (!isWellFormedJwt(session.access_token) || (session.expires_at ?? 0) <= Math.floor(Date.now() / 1000) + 30) {
    const token = await refreshValidSession();
    return token;
  }

  return session.access_token;
}

/** Send an authenticated API request and refresh/retry once after a 401. */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const send = (token: string) => {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };

  let token = await getAccessToken();
  if (!token) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");

  let response = await send(token);
  if (response.status !== 401) return response;

  token = await refreshValidSession();
  response = await send(token);
  if (response.status === 401) {
    await supabase.auth.signOut();
    throw new Error("Sessiya yaroqsiz. Qaytadan tizimga kiring.");
  }
  return response;
}

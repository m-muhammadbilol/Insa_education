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

export async function getAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  let session = data.session;
  if (!session) return null;

  // Refresh shortly before expiry so mobile pages do not race an expired token.
  if ((session.expires_at ?? 0) <= Math.floor(Date.now() / 1000) + 30) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) throw refreshError;
    session = refreshed.session;
  }

  return session?.access_token ?? null;
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

  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session?.access_token) {
    await supabase.auth.signOut();
    throw new Error("Sessiya eskirgan. Iltimos, qaytadan kiring.");
  }

  token = data.session.access_token;
  response = await send(token);
  if (response.status === 401) {
    await supabase.auth.signOut();
    throw new Error("Sessiyani tekshirib bo'lmadi. Iltimos, qaytadan kiring.");
  }
  return response;
}

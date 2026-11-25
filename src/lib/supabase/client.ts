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
  return data.session?.access_token ?? null;
}

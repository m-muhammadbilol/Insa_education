import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | undefined;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error(
      "SUPABASE_ADMIN_CONFIG_MISSING: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
  }

  adminClient = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

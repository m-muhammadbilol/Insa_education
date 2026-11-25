/**
 * Deterministic mapping from username to Supabase Auth internal email.
 * Supabase Auth handles password hashing and verification
 * without needing user-facing emails.
 */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function usernameToInternalEmail(username: string): string {
  const normalized = normalizeUsername(username);
  // Ensure the local part meets standard email format
  const sanitized = normalized.replace(/[^a-z0-9._-]/g, "_");
  return `${sanitized}@insa.internal`;
}

/**
 * Deterministic mapping from username to Firebase Auth internal email.
 * This keeps Firebase Auth as the secure password hashing and verification engine
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

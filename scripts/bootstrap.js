/** Create the first INSA Education Super Admin in Supabase (one time). */

require("@next/env").loadEnvConfig(process.cwd());

const { createClient } = require("@supabase/supabase-js");

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function usernameToInternalEmail(username) {
  const sanitized = normalizeUsername(username).replace(/[^a-z0-9._-]/g, "_");
  return `${sanitized}@insa.internal`;
}

async function bootstrap() {
  const username = process.env.BOOTSTRAP_SUPERADMIN_USERNAME;
  const password = process.env.BOOTSTRAP_SUPERADMIN_PASSWORD;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!username || !password) {
    throw new Error("BOOTSTRAP_SUPERADMIN_USERNAME and BOOTSTRAP_SUPERADMIN_PASSWORD are required.");
  }
  if (!url || !secretKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required.");
  }

  const supabase = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Checking for an existing Super Admin...");
  const { data: existing, error: lookupError } = await supabase
    .from("profiles")
    .select("uid")
    .eq("role", "SUPER_ADMIN")
    .limit(1)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) {
    console.log("A Super Admin already exists. No changes were made.");
    return;
  }

  const normalizedUsername = normalizeUsername(username);
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: usernameToInternalEmail(username),
    password,
    email_confirm: true,
    user_metadata: { username },
  });
  if (authError || !authData.user) throw authError || new Error("Could not create auth user.");

  const now = new Date().toISOString();
  const profile = {
    uid: authData.user.id,
    username: username.trim(),
    normalized_username: normalizedUsername,
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    must_change_password: true,
    created_at: now,
    updated_at: now,
    last_login_at: null,
  };

  const { error: profileError } = await supabase.from("profiles").insert(profile);
  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw profileError;
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_uid: authData.user.id,
    actor_role: "SYSTEM",
    actor_username: "BOOTSTRAP_PROCEDURE",
    action: "SUPERADMIN_BOOTSTRAP",
    target_type: "ADMIN",
    target_id: authData.user.id,
    timestamp: now,
    relevant_metadata: { username: username.trim(), role: "SUPER_ADMIN" },
  });
  if (auditError) throw auditError;

  console.log("Super Admin account created. Change the temporary password at first login.");
}

bootstrap().catch((error) => {
  console.error("Super Admin bootstrap failed:", error.message);
  process.exitCode = 1;
});

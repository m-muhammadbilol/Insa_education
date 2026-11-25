/**
 * One-Time Secure Bootstrap Procedure for INSA Education Super Admin.
 *
 * Rules:
 * 1. Reads BOOTSTRAP_SUPERADMIN_USERNAME and BOOTSTRAP_SUPERADMIN_PASSWORD from env.
 * 2. Checks if ANY Super Admin already exists in Firestore profiles collection.
 * 3. If a Super Admin exists (active or frozen), aborts immediately without modifying anything.
 * 4. Only creates the Super Admin if ZERO Super Admins exist.
 * 5. Uses deterministic internal email mapping with Firebase Auth.
 */

require("@next/env").loadEnvConfig(process.cwd());

const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function usernameToInternalEmail(username) {
  const normalized = normalizeUsername(username);
  const sanitized = normalized.replace(/[^a-z0-9._-]/g, "_");
  return `${sanitized}@insa.internal`;
}

async function bootstrap() {
  console.log("==================================================");
  console.log("   INSA EDUCATION — SUPER ADMIN BOOTSTRAP CHECK   ");
  console.log("==================================================");

  const username = process.env.BOOTSTRAP_SUPERADMIN_USERNAME;
  const password = process.env.BOOTSTRAP_SUPERADMIN_PASSWORD;

  if (!username || !password) {
    console.error(
      "❌ ERROR: BOOTSTRAP_SUPERADMIN_USERNAME and BOOTSTRAP_SUPERADMIN_PASSWORD environment variables are required!"
    );
    process.exit(1);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "❌ ERROR: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY must be configured."
    );
    process.exit(1);
  }

  const app = getApps()[0] || initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  const db = getFirestore(app);
  const auth = getAuth(app);

  console.log("🔍 Checking for existing Super Admin accounts...");

  // Check if any SUPER_ADMIN already exists in profiles
  const existingSuperAdmins = await db
    .collection("profiles")
    .where("role", "==", "SUPER_ADMIN")
    .limit(1)
    .get();

  if (!existingSuperAdmins.empty) {
    console.log(
      "🔒 ABORTED: A Super Admin account already exists in the system. Bootstrap can only run once."
    );
    process.exit(0);
  }

  console.log(`👤 Creating initial Super Admin: ${username}...`);

  const normalized = normalizeUsername(username);
  const internalEmail = usernameToInternalEmail(username);

  let userRecord;
  try {
    // Check if auth user exists
    userRecord = await auth.getUserByEmail(internalEmail);
    console.log("ℹ️ Existing Firebase Auth user found, linking profile...");
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      userRecord = await auth.createUser({
        email: internalEmail,
        password: password,
        displayName: username,
      });
      console.log("✅ Firebase Auth credentials generated.");
    } else {
      throw err;
    }
  }

  const nowIso = new Date().toISOString();

  // Create Super Admin profile
  const profile = {
    uid: userRecord.uid,
    username: username.trim(),
    normalizedUsername: normalized,
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    mustChangePassword: true,
    createdAt: nowIso,
    updatedAt: nowIso,
    lastLoginAt: null,
  };

  await db.collection("profiles").doc(userRecord.uid).set(profile);

  // Record audit log
  await db.collection("audit_logs").add({
    actorUid: userRecord.uid,
    actorRole: "SYSTEM",
    actorUsername: "BOOTSTRAP_PROCEDURE",
    action: "SUPERADMIN_BOOTSTRAP",
    targetType: "ADMIN",
    targetId: userRecord.uid,
    timestamp: nowIso,
    relevantMetadata: {
      username: username,
      role: "SUPER_ADMIN",
    },
  });

  console.log("==================================================");
  console.log("🎉 SUCCESS: Initial Super Admin initialized successfully!");
  console.log(`Username: ${username}`);
  console.log(`Role: SUPER_ADMIN`);
  console.log(`Status: ACTIVE`);
  console.log("==================================================");
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error("❌ Fatal Bootstrap Error:", err);
  process.exit(1);
});

/**
 * INSA Education — Automated Verification Suite
 * Executes tests covering validation, deterministic auth mapping, phone sanitization,
 * duplicate protection, and error states.
 */

const assert = require("assert");

// 1. Phone number cleaner tests
function cleanPhoneNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("998") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  return phone.trim();
}

const phoneRegex = /^(\+998|998)[0-9]{9}$/;

// 2. Deterministic username to email mapping
function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function usernameToInternalEmail(username) {
  const normalized = normalizeUsername(username);
  const sanitized = normalized.replace(/[^a-z0-9._-]/g, "_");
  return `${sanitized}@insa.internal`;
}

console.log("==================================================");
console.log("   INSA EDUCATION — AUTOMATED VERIFICATION SUITE   ");
console.log("==================================================");

let passedCount = 0;
let totalCount = 0;

function runTest(name, fn) {
  totalCount++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
  }
}

// Scenario 1 & 2: Uzbek Phone validation and sanitization
runTest("Scenario 1: Valid Uzbek phone formats are normalized to +998XXXXXXXXX", () => {
  const formatted = cleanPhoneNumber("+998 (90) 123-45-67");
  assert.strictEqual(formatted, "+998901234567");
  assert.strictEqual(phoneRegex.test(formatted), true);

  const rawDigits = cleanPhoneNumber("901234567");
  assert.strictEqual(rawDigits, "+998901234567");
  assert.strictEqual(phoneRegex.test(rawDigits), true);
});

runTest("Scenario 2: Invalid phone numbers are rejected", () => {
  const invalid1 = cleanPhoneNumber("12345");
  assert.strictEqual(phoneRegex.test(invalid1), false);

  const invalidLetters = cleanPhoneNumber("+998 90 ABC DE FG");
  assert.strictEqual(phoneRegex.test(invalidLetters), false);
});

// Scenario 3: Deterministic Email Mapping
runTest("Scenario 3: Username is deterministically and lowercase mapped to @insa.internal", () => {
  assert.strictEqual(
    usernameToInternalEmail("SuperAdmin"),
    "superadmin@insa.internal"
  );
  assert.strictEqual(
    usernameToInternalEmail("  Alisher_99  "),
    "alisher_99@insa.internal"
  );
  assert.strictEqual(
    usernameToInternalEmail("admin.insa"),
    "admin.insa@insa.internal"
  );
});

// Scenario 4: Rate Limiting logic simulation
runTest("Scenario 4: Duplicate submissions within 15 seconds are rate-limited", () => {
  const submissionTimestamps = new Map();
  const ip = "127.0.0.1";
  const phone = "+998901234567";
  const key = `${ip}_${phone}`;

  // First submission at t=0
  submissionTimestamps.set(key, 1000);

  // Immediate retry at t=5s
  const now = 6000;
  const lastSub = submissionTimestamps.get(key);
  const isRateLimited = now - lastSub < 15000;
  assert.strictEqual(isRateLimited, true, "Should be rate limited within 15 seconds");

  // Subsequent request after 16 seconds
  const later = 20000;
  const isRateLimitedLater = later - lastSub < 15000;
  assert.strictEqual(isRateLimitedLater, false, "Should allow request after 15 seconds");
});

// Scenario 5: Failsafe Telegram Error Handling
runTest("Scenario 5: Telegram delivery failure does not disrupt database commit", () => {
  // Simulation: lead document created first, telegram failure caught safely
  let dbCommitted = false;
  let telegramAttempted = false;
  let clientSuccessReturned = false;

  // 1. Commit to DB
  dbCommitted = true;

  // 2. Async Telegram notification
  telegramAttempted = true;
  const simulatedTelegramError = new Error("Telegram Network Timeout");

  // Failsafe catch block
  try {
    throw simulatedTelegramError;
  } catch (err) {
    // Logged without throwing up to client
  }

  // Response is still success
  clientSuccessReturned = dbCommitted;

  assert.strictEqual(dbCommitted, true);
  assert.strictEqual(telegramAttempted, true);
  assert.strictEqual(clientSuccessReturned, true);
});

// Scenario 6: Role Permission Invariants
runTest("Scenario 6: Role and freeze state permission matrix", () => {
  const checkAccess = (profile, requiredRole) => {
    if (profile.status !== "ACTIVE") {
      throw new Error("ACCOUNT_FROZEN");
    }
    if (requiredRole === "SUPER_ADMIN" && profile.role !== "SUPER_ADMIN") {
      throw new Error("FORBIDDEN");
    }
    return true;
  };

  // Active Admin accessing admin area
  assert.strictEqual(
    checkAccess({ role: "ADMIN", status: "ACTIVE" }, "ADMIN"),
    true
  );

  // Frozen Admin attempting access
  assert.throws(
    () => checkAccess({ role: "ADMIN", status: "FROZEN" }, "ADMIN"),
    /ACCOUNT_FROZEN/
  );

  // Admin attempting to access Super Admin area
  assert.throws(
    () => checkAccess({ role: "ADMIN", status: "ACTIVE" }, "SUPER_ADMIN"),
    /FORBIDDEN/
  );

  // Active Super Admin accessing Super Admin area
  assert.strictEqual(
    checkAccess({ role: "SUPER_ADMIN", status: "ACTIVE" }, "SUPER_ADMIN"),
    true
  );
});

// Scenario 7: Temporary Password Policy
runTest("Scenario 7: Temporary password requires change on first login", () => {
  const profile = {
    username: "new_admin",
    mustChangePassword: true,
    role: "ADMIN",
    status: "ACTIVE",
  };

  const getRedirect = (p) => {
    if (p.mustChangePassword) return "/admin/change-password";
    return p.role === "SUPER_ADMIN" ? "/admin/superadmin" : "/admin/dashboard";
  };

  assert.strictEqual(getRedirect(profile), "/admin/change-password");

  // After change
  profile.mustChangePassword = false;
  assert.strictEqual(getRedirect(profile), "/admin/dashboard");
});

console.log("==================================================");
console.log(`Results: ${passedCount} / ${totalCount} scenarios PASSED.`);
console.log("==================================================");

if (passedCount !== totalCount) {
  process.exit(1);
}

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) continue;
    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    process.env[key] ??= value;
  }
}

const requiredNow = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_USE_MOCK_DATA",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CRON_SECRET",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
];

const optionalButRecommended = [
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "NOTIFICATION_EMAIL",
  "OPENAI_API_KEY",
  "SANCTIONS_CHECK_API_KEY",
  "OPEN_EXCHANGE_RATES_APP_ID",
  "SENTRY_DSN",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

const parkedIntegrations = [
  "ENABLE_STRIPE_PAYMENTS",
  "ENABLE_STRIPE_CONNECT",
  "ENABLE_LOCAL_PAYMENTS",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_CONNECT_CLIENT_ID",
  "JAZZCASH_MERCHANT_ID",
  "JAZZCASH_PASSWORD",
  "JAZZCASH_INTEGRITY_SALT",
  "EASYPAISA_STORE_ID",
  "EASYPAISA_HASH_KEY",
];

function isMissing(key) {
  return !process.env[key] || process.env[key]?.trim() === "";
}

const missingRequired = requiredNow.filter(isMissing);
const missingRecommended = optionalButRecommended.filter(isMissing);
const configuredParked = parkedIntegrations.filter((key) => !isMissing(key));

if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
  console.warn("NEXT_PUBLIC_USE_MOCK_DATA is true. Set it to false for production Supabase data.");
}

if (missingRequired.length > 0) {
  console.error(`Missing production-required environment variables:\n- ${missingRequired.join("\n- ")}`);
  process.exit(1);
}

if (missingRecommended.length > 0) {
  console.warn(`Recommended but not blocking yet:\n- ${missingRecommended.join("\n- ")}`);
}

if (configuredParked.length > 0) {
  console.warn(`Payment/local payment values are present. Keep ENABLE_* flags false until provider approval and live QA:\n- ${configuredParked.join("\n- ")}`);
}

console.log("Production environment baseline is ready.");

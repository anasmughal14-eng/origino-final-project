import { fail } from "@/lib/api-response";

export function assertIntegrationEnabled(name: string, enabledEnv: string, requiredEnv: string[]) {
  if (process.env[enabledEnv] !== "true") {
    return fail(`${name} is parked until provider approval is complete`, 503);
  }

  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    return fail(`${name} is not configured: missing ${missing.join(", ")}`, 503);
  }

  return null;
}

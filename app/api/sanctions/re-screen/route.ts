import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";

export async function GET(request: Request) {
  const unauthorized = assertCronRequest(request);
  if (unauthorized) return unauthorized;
  return ok({ screened: 0, flagged: 0, completedAt: new Date().toISOString() });
}

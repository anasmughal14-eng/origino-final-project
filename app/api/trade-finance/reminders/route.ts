import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";

export async function GET(request: Request) {
  const unauthorized = assertCronRequest(request);
  if (unauthorized) return unauthorized;
  return ok({ repaymentRemindersSent: 0, checkedAt: new Date().toISOString() });
}

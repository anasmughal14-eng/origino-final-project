import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";

export async function GET(request: Request) {
  const unauthorized = assertCronRequest(request);
  if (unauthorized) return unauthorized;
  return ok({ base: "USD", rates: { PKR: 278.5, EUR: 0.92, GBP: 0.79, AED: 3.67 }, refreshedAt: new Date().toISOString() });
}

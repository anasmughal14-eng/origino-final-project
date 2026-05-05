import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";

export async function GET(request: Request) {
  const unauthorized = assertCronRequest(request);
  if (unauthorized) return unauthorized;
  return ok({ winnersCalculated: 3, status: "draft", quarter: "Q1-2026" });
}

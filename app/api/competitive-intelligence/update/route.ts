import { ok } from "@/lib/api-response";
import { assertCronRequest } from "@/lib/cron-auth";

export async function GET(request: Request) {
  const unauthorized = assertCronRequest(request);
  if (unauthorized) return unauthorized;
  return ok({ updated: true, categories: 5, message: "Mock competitive intelligence refreshed." });
}

export async function POST(request: Request) {
  const unauthorized = assertCronRequest(request);
  if (unauthorized) return unauthorized;
  return ok({ updated: true, categories: 5, message: "Mock competitive intelligence refreshed." });
}

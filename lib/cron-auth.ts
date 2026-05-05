import { fail } from "@/lib/api-response";

export function assertCronRequest(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return fail("CRON_SECRET is not configured", 500);

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) return fail("Unauthorized", 401);

  return null;
}

import { ok } from "@/lib/api-response";

export async function POST(request: Request) {
  await request.text();
  return ok({ confirmed: true, confirmedAt: new Date().toISOString() });
}

import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  const data = await readJson<Record<string, unknown>>(request);
  if (!data.token && !data.orderId) return fail("token or orderId is required", 400);
  return ok({ confirmed: true, status: "confirmed", confirmedAt: new Date().toISOString(), ...data });
}

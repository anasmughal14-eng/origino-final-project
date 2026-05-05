import { created, fail, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ email?: string; company?: string; country?: string; role?: string }>(request);
    if (!body.email || !body.email.includes("@")) return fail("Valid email is required", 400);
    return created({ id: `wait-${Date.now()}`, email: body.email, company: body.company ?? null, role: body.role ?? "buyer" });
  } catch {
    return fail("Unable to join waitlist", 500);
  }
}

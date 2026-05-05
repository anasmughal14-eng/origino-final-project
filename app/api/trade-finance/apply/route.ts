import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    if (!data.supplierId) return fail("supplierId is required", 400);
    if (!data.amountRequested && !data.amountPkr) return fail("amount is required", 400);
    return ok({ applicationId: `finance-${Date.now()}`, status: "pending", ...data }, 201);
  } catch {
    return fail("Unable to submit finance application", 500);
  }
}

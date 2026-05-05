import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  const data = await readJson<Record<string, unknown>>(request);
  if (!data.rfqId || !data.supplierId) return fail("rfqId and supplierId are required", 400);
  return ok({ responseId: `rfq-response-${Date.now()}`, status: "submitted", ...data }, 201);
}

import { created, fail, readJson, requireFields } from "@/lib/api-response";

const providers = ["SGS Pakistan", "Bureau Veritas Pakistan", "Intertek Pakistan", "TUV Rheinland Pakistan"];

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const missing = requireFields(body, ["orderId", "supplierId", "requestedDate"]);
    if (missing) return fail(`${missing} is required`, 400);
    const provider = providers[Math.floor(Math.random() * providers.length)];
    return created({
      inspectionId: `INS-${Date.now()}`,
      provider,
      status: "scheduled",
      scheduledDate: body.requestedDate,
      message: `Inspection booked with ${provider}.`,
    });
  } catch {
    return fail("Inspection booking failed", 500);
  }
}

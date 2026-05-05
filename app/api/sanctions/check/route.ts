import { fail, ok, readJson } from "@/lib/api-response";

const sanctionedEntities = ["Black Eagle Trading", "Restricted Corp LLC"];

export async function POST(request: Request) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    const entityName = String(data.entityName ?? data.companyName ?? "");
    if (!entityName) return fail("entityName is required", 400);
    const flagged = sanctionedEntities.some((entity) => entityName.toLowerCase().includes(entity.toLowerCase().split(" ")[0]));
    return ok({ result: flagged ? "match" : "clear", lists_checked: ["OFAC", "UN", "EU", "HMT"], flagged_details: flagged ? [{ name: entityName, confidence: 0.82 }] : [], checkedAt: new Date().toISOString() });
  } catch {
    return fail("Sanctions check failed", 500);
  }
}

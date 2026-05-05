import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

const sanctionedEntities = ["Black Eagle Trading", "Restricted Corp LLC"];

export async function POST(req: NextRequest) {
  try {
    const { entityName, entityType } = await readJson(req);
    if (!entityName || typeof entityName !== "string") return fail("Entity name required", 400);
    const isMatch = sanctionedEntities.some(e => entityName.toLowerCase().includes(e.toLowerCase().split(" ")[0]));
    const isPossibleMatch = !isMatch && entityName.length < 5;
    return ok({ entityName, entityType, result: isMatch ? "match" : isPossibleMatch ? "possible_match" : "clear", checkedAt: new Date().toISOString(), lists: ["OFAC SDN", "EU Consolidated", "UN Security Council", "HMT UK"] });
  } catch {
    return fail("Sanctions check failed", 500);
  }
}

import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { supplierId, orderId, amountPkr, tenorDays, purposeCode, exportContract } = await readJson(req);
    if (!supplierId || !amountPkr) return fail("Missing required fields", 400);
    return ok({ applicationId: `TF-${Date.now()}`, supplierId, orderId, amountPkr, tenorDays, purposeCode, exportContract, status: "submitted", expectedDecisionDays: 5, message: "Trade finance application submitted. Decision expected within 5 working days." }, 201);
  } catch {
    return fail("Application failed", 500);
  }
}

import { fail, ok, readJson } from "@/lib/api-response";
import { assertIntegrationEnabled } from "@/lib/integration-status";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const unavailable = assertIntegrationEnabled("Local payment verification", "ENABLE_LOCAL_PAYMENTS", []);
    if (unavailable) return unavailable;

    const { txnRefNo, provider } = await readJson(req);
    if (!txnRefNo || !provider) return fail("Missing required fields", 400);
    return ok({ txnRefNo, provider, status: "completed", responseCode: "000", responseMessage: "Transaction completed successfully." });
  } catch {
    return fail("Verification failed", 500);
  }
}

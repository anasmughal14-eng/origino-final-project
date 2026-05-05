import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, confirmedBy } = await readJson(req);
    if (!orderId) return fail("orderId required", 400);
    return ok({ orderId, confirmedBy, status: "confirmed", confirmedAt: new Date().toISOString(), message: "Order confirmed. Supplier has been notified to begin production." });
  } catch {
    return fail("Confirmation failed", 500);
  }
}

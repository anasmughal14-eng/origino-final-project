import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amountUsd, paymentMethod, stripePaymentIntentId } = await readJson(req);
    if (!orderId || !amountUsd) return fail("Missing orderId or amount", 400);
    return ok({ escrowId: `ESC-${Date.now()}`, orderId, amountUsd, paymentMethod, stripePaymentIntentId, status: "pending", clientSecret: "pi_mock_secret_for_dev", message: "Escrow funding initiated. Complete payment to activate." }, 201);
  } catch {
    return fail("Escrow funding failed", 500);
  }
}

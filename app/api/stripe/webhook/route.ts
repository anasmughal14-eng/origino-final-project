import { fail, ok } from "@/lib/api-response";
import { assertIntegrationEnabled } from "@/lib/integration-status";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const unavailable = assertIntegrationEnabled("Stripe webhook", "ENABLE_STRIPE_PAYMENTS", [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ]);
  if (unavailable) return unavailable;

  const signature = req.headers.get("stripe-signature");
  if (!signature) return fail("Missing signature", 400);

  try {
    await req.text();
    return ok({ received: true });
  } catch {
    return fail("Webhook error", 400);
  }
}

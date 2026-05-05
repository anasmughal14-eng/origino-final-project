import { fail, ok, readJson } from "@/lib/api-response";
import { assertIntegrationEnabled } from "@/lib/integration-status";

export async function POST(request: Request) {
  try {
    const unavailable = assertIntegrationEnabled("Stripe checkout", "ENABLE_STRIPE_PAYMENTS", [
      "STRIPE_SECRET_KEY",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    ]);
    if (unavailable) return unavailable;

    const body = await readJson<Record<string, unknown>>(request);
    if (!body.orderId || !body.amountUsd) return fail("orderId and amountUsd are required", 400);
    const successUrl = String(body.successUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
    return ok({
      sessionId: `cs_mock_${Date.now()}`,
      url: `${successUrl}${successUrl.includes("?") ? "&" : "?"}session_id=mock`,
      message: "Stripe checkout session created.",
    });
  } catch {
    return fail("Payment initiation failed", 500);
  }
}

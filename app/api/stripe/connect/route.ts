import { fail, ok, readJson } from "@/lib/api-response";
import { assertIntegrationEnabled } from "@/lib/integration-status";

export async function POST(request: Request) {
  try {
    const unavailable = assertIntegrationEnabled("Stripe Connect", "ENABLE_STRIPE_CONNECT", [
      "STRIPE_SECRET_KEY",
      "STRIPE_CONNECT_CLIENT_ID",
    ]);
    if (unavailable) return unavailable;

    const body = await readJson<{ supplierId?: string }>(request);
    if (!body.supplierId) return fail("supplierId is required", 400);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return ok({ onboardingUrl: `${appUrl}/seller/marketing?stripe_connect=mock`, accountId: `acct_mock_${body.supplierId}` });
  } catch {
    return fail("Unable to start Stripe Connect onboarding", 500);
  }
}

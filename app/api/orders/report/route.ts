import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    if (!data.buyerEmail && !data.buyerId) return fail("buyer email or buyerId is required", 400);
    if (!data.product && !data.productId) return fail("product is required", 400);
    return ok({ orderId: `reported-${Date.now()}`, status: "awaiting_buyer_confirmation", confirmationEmailQueued: true, ...data }, 201);
  } catch {
    return fail("Unable to report order", 500);
  }
}

import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ orderId?: string }>(request);
    if (!body.orderId) return fail("orderId is required", 400);
    return ok({ invoiceNumber: `FBR-${Date.now()}`, url: `/mock/fbr-invoice-${body.orderId}.pdf` });
  } catch {
    return fail("Unable to generate FBR invoice", 500);
  }
}

import { created, fail, readJson, requireFields } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const missing = requireFields(body, ["supplierId", "productId"]);
    if (missing) return fail(`${missing} is required`, 400);
    if (body.quantity !== undefined && Number.isNaN(Number(body.quantity))) return fail("quantity must be a number", 400);
    return created({
      requestId: `sample-${Date.now()}`,
      status: "pending",
      supplierId: body.supplierId,
      productId: body.productId,
    });
  } catch {
    return fail("Unable to request sample", 500);
  }
}

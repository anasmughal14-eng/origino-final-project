import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ supplierId?: string }>(request);
    if (!body.supplierId) return fail("supplierId is required", 400);
    return ok({ url: `/mock/catalog-${body.supplierId}.pdf`, message: "Catalog PDF generation is stubbed until Supabase Storage is connected." });
  } catch {
    return fail("Unable to generate catalog PDF", 500);
  }
}

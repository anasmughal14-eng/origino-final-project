import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { supplierId, buyerId, version } = await readJson(req);
    if (!supplierId || !buyerId) return fail("Missing required fields", 400);
    return ok({ ndaId: `NDA-${Date.now()}`, supplierId, buyerId, version, acceptedAt: new Date().toISOString(), message: "NDA accepted. Supplier contact details now accessible." }, 201);
  } catch {
    return fail("NDA acceptance failed", 500);
  }
}

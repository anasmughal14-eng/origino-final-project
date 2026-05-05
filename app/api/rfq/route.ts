import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, description, category } = await readJson(req);
    if (!title || !description || !category) return fail("Missing required fields", 400);
    return ok({ rfqId: `RFQ-${Date.now()}`, title, category, matchedSuppliers: 12, message: "RFQ published. Matched suppliers will be notified." }, 201);
  } catch {
    return fail("RFQ submission failed", 500);
  }
}

export async function GET() {
  return ok({ rfqs: [], total: 0 });
}

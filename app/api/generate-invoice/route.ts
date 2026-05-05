import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, type } = await readJson(req);
    if (!orderId) return fail("orderId required", 400);
    return ok({ invoiceId: `INV-${Date.now()}`, type: type || "commercial", downloadUrl: `/api/invoices/${orderId}/download`, message: "Invoice generated successfully." }, 201);
  } catch {
    return fail("Invoice generation failed", 500);
  }
}

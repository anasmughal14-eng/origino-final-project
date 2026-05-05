import { ok } from "@/lib/api-response";

export async function GET() {
  return ok({ base: "USD", rates: { PKR: 278.5, EUR: 0.92, GBP: 0.79, AED: 3.67, SAR: 3.75 }, updatedAt: new Date().toISOString() });
}

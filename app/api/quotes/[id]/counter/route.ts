import { fail, ok, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    const counterPrice = data.counterPrice ?? data.unitPrice ?? data.priceUsd ?? data.unitPriceUsd;
    const leadTime = data.leadTime ?? data.leadTimeDays ?? data.lead_time;
    if (counterPrice === undefined || Number.isNaN(Number(counterPrice))) return fail("counter price is required", 400);
    if (leadTime === undefined || String(leadTime).trim().length === 0) return fail("lead time is required", 400);
    if (!USE_MOCK_DATA) {
      const db = createSupabaseServiceClient();
      const { data: original, error: originalError } = await db.from("quotes").select("*").eq("id", params.id).single();
      if (originalError || !original) return fail("Quote not found", 404);
      const { data: counter, error } = await db
        .from("quotes")
        .insert({
          buyer_id: original.buyer_id,
          supplier_id: original.supplier_id,
          product_id: original.product_id,
          status: "countered",
          quantity: original.quantity,
          unit: original.unit,
          target_price_usd: original.target_price_usd,
          offered_price_usd: Number(counterPrice),
          final_price_usd: null,
          currency: original.currency,
          lead_time_requested: original.lead_time_requested,
          lead_time_offered: String(leadTime),
          notes: String(data.notes ?? `Counter offer for quote ${original.id}.`),
          buyer_notes: `Counter offer linked to ${original.id}.`,
          expires_at: original.expires_at,
        })
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      await db.from("quotes").update({ status: "countered" }).eq("id", original.id);
      return ok({ originalQuoteId: params.id, newQuoteId: counter.id, status: "countered", counterPrice: Number(counterPrice), leadTime: String(leadTime), quote: counter }, 201);
    }
    return ok(
      {
        originalQuoteId: params.id,
        newQuoteId: `quote-counter-${Date.now()}`,
        status: "countered",
        counterPrice: Number(counterPrice),
        leadTime: String(leadTime),
        ...data,
      },
      201,
    );
  } catch {
    return fail("Unable to create counter-offer", 500);
  }
}

import { fail, ok } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { addRuntimeEscrow, addRuntimeOrder, listRuntimeQuotes, updateRuntimeQuote } from "@/lib/mock-runtime-store";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { EscrowTransaction, Order } from "@/types/database";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    if (!USE_MOCK_DATA) {
      const db = createSupabaseServiceClient();
      const { data: quote, error: quoteError } = await db.from("quotes").select("*").eq("id", params.id).single();
      if (quoteError || !quote) return fail("Quote not found", 404);
      const price = quote.offered_price_usd ?? quote.target_price_usd ?? 0;
      const { data: order, error: orderError } = await db
        .from("orders")
        .insert({
          buyer_id: quote.buyer_id,
          supplier_id: quote.supplier_id,
          product_id: quote.product_id,
          status: "confirmed",
          quantity: quote.quantity,
          unit: quote.unit,
          price_usd: price,
          total_usd: price * quote.quantity,
          currency: quote.currency,
          payment_method: "escrow",
          escrow_status: "funded",
          tracking_number: null,
          notes: `Created automatically when quote ${quote.id} was accepted.`,
        })
        .select("*")
        .single();
      if (orderError) return fail(orderError.message, 500);
      const { data: escrow, error: escrowError } = await db
        .from("escrow_transactions")
        .insert({
          order_id: order.id,
          amount_usd: order.total_usd,
          currency: order.currency,
          status: "funded",
          stripe_payment_intent: `pi_pending_${order.id}`,
          funded_at: new Date().toISOString(),
          released_at: null,
          dispute_reason: null,
        })
        .select("*")
        .single();
      if (escrowError) return fail(escrowError.message, 500);
      await db.from("quotes").update({ status: "accepted", final_price_usd: price }).eq("id", quote.id);
      return ok({ quoteId: params.id, status: "accepted", orderId: order.id, escrowId: escrow.id, order, escrow, escrowRequired: true }, 201);
    }
    const quote = listRuntimeQuotes().find((item) => item.id === params.id);
    if (!quote) return fail("Quote not found", 404);
    const now = new Date().toISOString();
    const price = quote.offered_price_usd ?? quote.target_price_usd ?? 0;
    const order: Order = {
      id: `ord-${Date.now()}`,
      buyer_id: quote.buyer_id,
      supplier_id: quote.supplier_id,
      product_id: quote.product_id,
      status: "confirmed",
      quantity: quote.quantity,
      unit: quote.unit,
      price_usd: price,
      total_usd: price * quote.quantity,
      currency: quote.currency,
      payment_method: "stripe",
      escrow_status: "funded",
      tracking_number: null,
      notes: `Created automatically when quote ${quote.id} was accepted.`,
      created_at: now,
      updated_at: now,
    };
    const escrow: EscrowTransaction = {
      id: `esc-${order.id}`,
      order_id: order.id,
      amount_usd: order.total_usd,
      currency: order.currency,
      status: "funded",
      stripe_payment_intent: `pi_mock_${order.id}`,
      funded_at: now,
      released_at: null,
      dispute_reason: null,
      created_at: now,
    };
    updateRuntimeQuote(quote.id, { status: "accepted", final_price_usd: price });
    addRuntimeOrder(order);
    addRuntimeEscrow(escrow);
    return ok({ quoteId: params.id, status: "accepted", orderId: order.id, escrowId: escrow.id, order, escrow, escrowRequired: true }, 201);
  } catch {
    return fail("Unable to accept quote", 500);
  }
}

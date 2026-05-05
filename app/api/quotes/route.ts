import { created, fail, ok, readJson, requireFields } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { mockProducts } from "@/lib/mock-data";
import { addRuntimeQuote, listRuntimeQuotes, updateRuntimeQuote } from "@/lib/mock-runtime-store";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Quote } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return fail(error.message, 500);
      return ok(data);
    }
    return ok(listRuntimeQuotes());
  } catch {
    return fail("Unable to load quotes", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const missing = requireFields(body, ["supplierId", "quantity"]);
    if (missing) return fail(`${missing} is required`, 400);
    const quantity =
      typeof body.quantity === "string"
        ? Number(body.quantity.match(/\d+(\.\d+)?/)?.[0])
        : Number(body.quantity);
    if (!quantity || Number.isNaN(quantity)) return fail("quantity must be a number", 400);
    const supplierId = String(body.supplierId);
    const db = !USE_MOCK_DATA ? createSupabaseServiceClient() : null;
    let liveBuyerId = body.buyerId ? String(body.buyerId) : "";
    if (db && !liveBuyerId) {
      const { data: buyer, error: buyerError } = await db.from("profiles").select("id").eq("role", "buyer").limit(1).maybeSingle();
      if (buyerError) return fail(buyerError.message, 500);
      liveBuyerId = buyer?.id ?? "";
    }
    if (db && !liveBuyerId) return fail("buyerId is required", 400);
    const realProduct =
      db && body.productId
        ? await db.from("products").select("*").eq("id", String(body.productId)).maybeSingle()
        : null;
    if (realProduct?.error) return fail(realProduct.error.message, 500);
    let product = realProduct?.data ?? mockProducts.find((item) => item.supplier_id === supplierId) ?? mockProducts[0];
    if (db && !realProduct?.data) {
      const { data: fallbackProduct, error: productError } = await db.from("products").select("*").eq("supplier_id", supplierId).limit(1).maybeSingle();
      if (productError) return fail(productError.message, 500);
      if (!fallbackProduct) return fail("productId is required", 400);
      product = fallbackProduct;
    }
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
    const offeredPrice =
      body.offeredPriceUsd !== undefined
        ? Number(body.offeredPriceUsd)
        : body.unitPriceUsd !== undefined
          ? Number(body.unitPriceUsd)
          : product.price_usd_max;
    const quote: Quote = {
      id: `quote-${Date.now()}`,
      buyer_id: String(liveBuyerId || body.buyerId || "buyer-1"),
      supplier_id: supplierId,
      product_id: String(body.productId ?? product.id),
      status: "responded",
      quantity,
      unit: String(body.unit ?? product.moq_unit),
      target_price_usd: body.targetPriceUsd !== undefined ? Number(body.targetPriceUsd) : product.price_usd_min,
      offered_price_usd: Number.isNaN(offeredPrice) ? product.price_usd_max : offeredPrice,
      final_price_usd: null,
      currency: "USD",
      lead_time_requested: String(body.leadTimeRequested ?? "30 days"),
      lead_time_offered: String(body.leadTimeOffered ?? body.leadTimeDays ?? body.leadTime ?? `${product.lead_time_days} days`),
      notes: String(body.notes ?? "Formal supplier quote."),
      buyer_notes: body.inquiryId ? `Created from inquiry ${String(body.inquiryId)}.` : null,
      expires_at: expiresAt,
      created_at: now,
      updated_at: now,
    };
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("quotes")
        .insert({
          buyer_id: quote.buyer_id,
          supplier_id: quote.supplier_id,
          product_id: quote.product_id,
          status: quote.status,
          quantity: quote.quantity,
          unit: quote.unit,
          target_price_usd: quote.target_price_usd,
          offered_price_usd: quote.offered_price_usd,
          final_price_usd: quote.final_price_usd,
          currency: quote.currency,
          lead_time_requested: quote.lead_time_requested,
          lead_time_offered: quote.lead_time_offered,
          notes: quote.notes,
          buyer_notes: quote.buyer_notes,
          expires_at: quote.expires_at,
        })
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return created({ quoteId: data.id, quote: data, status: data.status, expiresAt: data.expires_at });
    }
    addRuntimeQuote(quote);
    return created({ quoteId: quote.id, quote, status: quote.status, expiresAt });
  } catch {
    return fail("Unable to create quote", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{ quoteId?: string; action?: string }>(request);
    if (!body.quoteId || !body.action) return fail("quoteId and action are required", 400);
    if (!["accept", "decline", "reject", "counter"].includes(body.action)) return fail("Invalid quote action", 400);
    const status = body.action === "accept" ? "accepted" : body.action === "counter" ? "countered" : "rejected";
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("quotes")
        .update({ status })
        .eq("id", body.quoteId)
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok({ quoteId: body.quoteId, quote: data, action: body.action, status });
    }
    const quote = updateRuntimeQuote(body.quoteId, { status });
    return ok({ quoteId: body.quoteId, quote, action: body.action, status });
  } catch {
    return fail("Unable to update quote", 500);
  }
}

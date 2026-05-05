import { fail, ok, readJson, requireFields } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { mockProducts } from "@/lib/mock-data";
import { addRuntimeOrder, listRuntimeOrders, updateRuntimeOrder } from "@/lib/mock-runtime-store";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Order } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return fail(error.message, 500);
      return ok({ orders: data ?? [], total: data?.length ?? 0 });
    }
    const orders = listRuntimeOrders();
    return ok({ orders, total: orders.length });
  } catch {
    return fail("Unable to load orders", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const missing = requireFields(body, ["supplierId", "buyerId", "quantity"]);
    if (missing) return fail(`${missing} is required`, 400);
    const quantity = Number(body.quantity);
    if (!quantity || Number.isNaN(quantity)) return fail("quantity must be a number", 400);
    const product = mockProducts.find((item) => item.id === body.productId) ?? mockProducts.find((item) => item.supplier_id === body.supplierId) ?? mockProducts[0];
    const fallbackPrice = product.price_usd_max ?? product.price_usd_min ?? 0;
    const price = body.priceUsd !== undefined ? Number(body.priceUsd) : fallbackPrice;
    if (Number.isNaN(price)) return fail("priceUsd must be a number", 400);
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("orders")
        .insert({
          supplier_id: String(body.supplierId),
          buyer_id: String(body.buyerId),
          product_id: body.productId ? String(body.productId) : null,
          status: "pending",
          quantity,
          unit: String(body.unit ?? product.moq_unit),
          price_usd: price,
          total_usd: price * quantity,
          currency: "USD",
          payment_method: "escrow",
          escrow_status: "not_started",
          tracking_number: null,
          notes: String(body.notes ?? "Buyer placed order from trade flow."),
        })
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok({
        orderId: data.id,
        order: data,
        status: data.status,
        message: "Order placed. Escrow funding required to confirm.",
      }, 201);
    }
    const now = new Date().toISOString();
    const order: Order = {
      id: `ord-${Date.now()}`,
      buyer_id: String(body.buyerId),
      supplier_id: String(body.supplierId),
      product_id: String(body.productId ?? product.id),
      status: "pending",
      quantity,
      unit: String(body.unit ?? product.moq_unit),
      price_usd: price,
      total_usd: price * quantity,
      currency: "USD",
      payment_method: "stripe",
      escrow_status: "not_started",
      tracking_number: null,
      notes: String(body.notes ?? "Buyer placed order from mock trade flow."),
      created_at: now,
      updated_at: now,
    };
    addRuntimeOrder(order);
    return ok({
      orderId: order.id,
      order,
      status: order.status,
      message: "Order placed. Escrow funding required to confirm.",
    }, 201);
  } catch {
    return fail("Failed to create order", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const missing = requireFields(body, ["orderId", "status", "notes"]);
    if (missing) return fail(`${missing} is required`, 400);
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("orders")
        .update({ status: body.status as Order["status"], notes: String(body.notes) })
        .eq("id", String(body.orderId))
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok({
        orderId: body.orderId,
        status: body.status,
        notes: body.notes,
        order: data,
        selfReportedBySeller: true,
        updatedAt: data.updated_at,
        message: "Seller order milestone update saved.",
      });
    }
    const order = updateRuntimeOrder(String(body.orderId), { status: body.status as Order["status"], notes: String(body.notes) });
    return ok({
      orderId: body.orderId,
      status: body.status,
      notes: body.notes,
      order,
      selfReportedBySeller: true,
      updatedAt: new Date().toISOString(),
      message: "Seller order milestone update saved.",
    });
  } catch {
    return fail("Failed to update order", 500);
  }
}

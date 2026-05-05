import { fail, ok, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    if (!data.orderId) return fail("orderId is required", 400);
    const scheduledDate = String(data.scheduledDate ?? data.date ?? "");
    if (!scheduledDate) return fail("inspection date is required", 400);

    if (!USE_MOCK_DATA) {
      const db = createSupabaseServiceClient();
      const { data: order, error: orderError } = await db
        .from("orders")
        .select("id,buyer_id,supplier_id")
        .eq("id", String(data.orderId))
        .maybeSingle();
      if (orderError) return fail(orderError.message, 500);
      if (!order) return fail("Order not found", 404);

      const { data: booking, error } = await db
        .from("inspections")
        .insert({
          order_id: order.id,
          buyer_id: order.buyer_id,
          supplier_id: order.supplier_id,
          provider_id: typeof data.providerId === "string" ? data.providerId : null,
          status: "requested",
          scheduled_date: scheduledDate,
          result: null,
          report_url: null,
          notes: typeof data.notes === "string" ? data.notes : null,
        })
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok({ bookingId: booking.id, booking, status: booking.status, providerNotified: true }, 201);
    }

    return ok({ bookingId: `inspection-${Date.now()}`, status: "pending", providerNotified: true, ...data }, 201);
  } catch {
    return fail("Unable to book inspection", 500);
  }
}

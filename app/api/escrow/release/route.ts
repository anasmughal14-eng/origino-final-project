import { fail, ok, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { updateRuntimeEscrow, updateRuntimeOrder } from "@/lib/mock-runtime-store";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { escrowId, orderId, adminId } = await readJson(req);
    if (!escrowId || !adminId) return fail("Missing required fields", 400);
    const releasedAt = new Date().toISOString();
    if (!USE_MOCK_DATA) {
      const db = createSupabaseServiceClient();
      const { data: escrow, error: escrowError } = await db
        .from("escrow_transactions")
        .update({ status: "released", released_at: releasedAt })
        .eq("id", String(escrowId))
        .select("*")
        .single();
      if (escrowError) return fail(escrowError.message, 500);
      let order = null;
      if (orderId || escrow.order_id) {
        const { data: orderData, error: orderError } = await db
          .from("orders")
          .update({ escrow_status: "released" })
          .eq("id", String(orderId ?? escrow.order_id))
          .select("*")
          .maybeSingle();
        if (orderError) return fail(orderError.message, 500);
        order = orderData;
      }
      return ok({ escrowId, orderId: orderId ?? escrow.order_id, adminId, status: "released", escrow, order, releasedAt, message: "Funds released to supplier." });
    }
    const escrow = updateRuntimeEscrow(String(escrowId), { status: "released", released_at: releasedAt });
    const order = orderId ? updateRuntimeOrder(String(orderId), { escrow_status: "released" }) : null;
    return ok({ escrowId, orderId, adminId, status: "released", escrow, order, releasedAt, message: "Funds released to supplier." });
  } catch {
    return fail("Release failed", 500);
  }
}

import { fail, ok, readJson } from "@/lib/api-response";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { updateRuntimeEscrow, updateRuntimeOrder } from "@/lib/mock-runtime-store";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { escrowId, raisedBy, reason, evidence } = await readJson(req);
    if (!escrowId || !reason) return fail("Missing required fields", 400);
    if (!USE_MOCK_DATA) {
      const db = createSupabaseServiceClient();
      const disputeOpenedAt = new Date().toISOString();
      const { data: escrow, error: escrowError } = await db
        .from("escrow_transactions")
        .update({
          status: "disputed",
          dispute_reason: String(reason),
        })
        .eq("id", String(escrowId))
        .select("*")
        .single();
      if (escrowError) return fail(escrowError.message, 500);
      const { data: order, error: orderError } = await db
        .from("orders")
        .update({ status: "disputed", escrow_status: "disputed" })
        .eq("id", escrow.order_id)
        .select("*")
        .maybeSingle();
      if (orderError) return fail(orderError.message, 500);
      return ok({ disputeId: `DIS-${Date.now()}`, escrowId, raisedBy, evidence, status: "opened", escrow, order, message: "Dispute opened. Admin team notified. Funds held pending resolution." }, 201);
    }
    const escrow = updateRuntimeEscrow(String(escrowId), { status: "disputed", dispute_reason: String(reason) });
    const order = escrow?.order_id ? updateRuntimeOrder(escrow.order_id, { escrow_status: "disputed", status: "disputed" }) : null;
    return ok({ disputeId: `DIS-${Date.now()}`, escrowId, raisedBy, evidence, status: "opened", escrow, order, message: "Dispute opened. Admin team notified. Funds held pending resolution." }, 201);
  } catch {
    return fail("Dispute creation failed", 500);
  }
}

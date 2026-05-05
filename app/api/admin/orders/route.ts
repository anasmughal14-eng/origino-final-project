import { fail, ok, readJson } from "@/lib/api-response";
import { updateRuntimeOrder } from "@/lib/mock-runtime-store";
import { USE_MOCK_DATA } from "@/lib/data-service";
import { mockOrders } from "@/lib/mock-data";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Order } from "@/types/database";

export async function GET() {
  try {
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return fail(error.message, 500);
      return ok({ orders: data });
    }
    return ok({ orders: mockOrders });
  } catch {
    return fail("Unable to load admin orders", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    if (!body.id) return fail("order id is required", 400);
    if (!body.status && !body.escrow_status && !body.notes) return fail("update payload is required", 400);
    if (!USE_MOCK_DATA) {
      const { data, error } = await createSupabaseServiceClient()
        .from("orders")
        .update({
          status: body.status as Order["status"] | undefined,
          escrow_status: body.escrow_status as Order["escrow_status"] | undefined,
          notes: body.notes ? String(body.notes) : undefined,
        })
        .eq("id", String(body.id))
        .select("*")
        .single();
      if (error) return fail(error.message, 500);
      return ok({
        id: body.id,
        status: data.status,
        escrow_status: data.escrow_status,
        notes: data.notes,
        order: data,
        updatedAt: new Date().toISOString(),
      });
    }
    const order = updateRuntimeOrder(String(body.id), {
      status: body.status as Order["status"] | undefined,
      escrow_status: body.escrow_status as Order["escrow_status"] | undefined,
      notes: body.notes ? String(body.notes) : undefined,
    });

    return ok({
      id: body.id,
      status: body.status,
      escrow_status: body.escrow_status,
      notes: body.notes,
      order,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return fail("Unable to update order", 500);
  }
}
